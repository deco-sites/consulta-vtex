import type { ProductListingPage } from "../commerce/types.ts";
import { SortOption } from "apps/commerce/types.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import type { AppContext } from "apps/wake/mod.ts";
import type { CategoryThumb } from "../commerce/attributesTypes.ts";
import {
  getVariations,
  MAXIMUM_REQUEST_QUANTITY,
} from "apps/wake/utils/getVariations.ts";
import {
  GetCategory,
  GetCategoryChildren,
  GetPartners,
  GetURL,
  Hotsite,
  Search,
} from "../utils/graphql/queries.ts";
import {
  GetCategoryChildrens,
  GetCategoryChildrenVariables,
  GetCategoryProductsQuery,
  GetCategoryProductsQueryVariables,
  GetPartnersQuery,
  GetPartnersQueryVariables,
  GetUrlQuery,
  GetUrlQueryVariables,
  HotsiteQuery,
  HotsiteQueryVariables,
  ProductFragment,
  ProductSortKeys,
  SearchQuery,
  SearchQueryVariables,
  SortDirection,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { getPartnerCookie } from "apps/wake/utils/partner.ts";
import {
  FILTER_PARAM,
  toBreadcrumbList,
  toFilters,
  toProduct,
} from "../utils/transform.ts";
import { Filters } from "apps/wake/loaders/productList.ts";
import { logger } from "@deco/deco/o11y";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { getSubstance } from "../sdk/getSubstance.ts";
import { getTherapeuticClass } from "../sdk/getTherapeuticClass.ts";
import {
  getCategory,
  getCategoryForSlus,
  getCategoryThumbs,
  getDisease,
  getTerms,
} from "../sdk/getCategory.ts";
import Logo from "deco-sites/consul-remedio/components/footer/Logo.tsx";

export type Sort =
  | "NAME:ASC"
  | "NAME:DESC"
  | "RELEASE_DATE:DESC"
  | "PRICE:ASC"
  | "PRICE:DESC"
  | "DISCOUNT:DESC"
  | "SALES:DESC";

export const SORT_OPTIONS: SortOption[] = [
  { value: "NAME:ASC", label: "Nome A-Z" },
  { value: "NAME:DESC", label: "Nome Z-A" },
  { value: "RELEASE_DATE:DESC", label: "Lançamentos" },
  { value: "PRICE:ASC", label: "Menores Preços" },
  { value: "PRICE:DESC", label: "Maiores Preços" },
  { value: "DISCOUNT:DESC", label: "Maiores Descontos" },
  { value: "SALES:DESC", label: "Mais Vendidos" },
];

type SortValue = `${ProductSortKeys}:${SortDirection}`;
export interface Props {
  /**
   * @title Count
   * @description Number of products to display
   * @maximum 50
   * @default 12
   */
  limit?: number;

  /** @description Types of operations to perform between query terms */
  operation?: "AND" | "OR";

  /**
   * @ignore
   */
  page: number;

  /**
   * @title Sorting
   */
  sort?: Sort;

  /**
   * @description overides the query term
   */
  query?: string;

  /**
   * @title Only Main Variant
   * @description Toggle the return of only main variants or all variations separeted.
   */
  onlyMainVariant?: boolean;

  filters?: Filters;

  /** @description Retrieve variantions for each product. */
  getVariations?: boolean;

  /**
   * @title Starting page query parameter offset.
   * @description Set the starting page offset. Default to 1.
   */
  pageOffset?: 0 | 1;

  /**
   * @hide true
   * @description The URL of the page, used to override URL from request
   */
  pageHref?: string;

  /**
   * @title Partner Param
   * @description page param to partners page
   * @deprecated
   */
  slug?: RequestURLParam;

  /**
   * @title Partner Param
   * @description page param to partners page
   */
  partnerAlias?: RequestURLParam;
}

const OUTSIDE_ATTRIBUTES_FILTERS = ["precoPor"];

const filtersFromParams = (searchParams: URLSearchParams) => {
  const filters: Array<{ field: string; values: string[] }> = [];

  searchParams.getAll(FILTER_PARAM).forEach((value) => {
    const test = /.*:.*/;
    const [field, val] = test.test(value)
      ? value.split(":")
      : value.split("__");

    if (!OUTSIDE_ATTRIBUTES_FILTERS?.includes(field)) {
      filters.push({ field, values: [val] });
    }
  });

  return filters;
};

/**
 * @title Wake Integration
 * @description Product Listing Page loader
 */
const searchLoader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<ProductListingPage | null> => {
  // get url from params
  const url = new URL(req.url).pathname === "/live/invoke"
    ? new URL(props.pageHref || req.headers.get("referer") || req.url)
    : new URL(props.pageHref || req.url);

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const partnerAlias = props.partnerAlias ?? props.slug;

  const partnerAccessTokenCookie = getPartnerCookie(req.headers);

  const headers = parseHeaders(req.headers);
  console.log("Headers", headers);

  const limit = Number(url.searchParams.get("tamanho") ?? props.limit ?? 24);

  const filters = filtersFromParams(url.searchParams) ?? props.filters;
  const sort = (url.searchParams.get("sort") as SortValue | null) ??
    (url.searchParams.get("ordenacao") as SortValue | null) ??
    props.sort ??
    "SALES:DESC";

  const page = props.page ?? Number(url.searchParams.get("pagina")) ?? 0;

  const query = props.query ??
    decodeURIComponent(url.pathname)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split("/b/")[1]
      ?.split("?")[0];
  const operation = props.operation ?? "AND";

  const [sortKey, sortDirection] = sort.split(":") as [
    ProductSortKeys,
    SortDirection,
  ];

  const onlyMainVariant = props.onlyMainVariant ?? true;

  const offset = page <= 1 ? 0 : (page - 1) * limit;

  const partnerData = partnerAlias
    ? await storefront.query<GetPartnersQuery, GetPartnersQueryVariables>(
      {
        variables: { first: 1, alias: [partnerAlias] },
        ...GetPartners,
      },
      { headers },
    )
    : null;

  const partnerAccessToken =
    partnerData?.partners?.edges?.[0]?.node?.partnerAccessToken ??
      partnerAccessTokenCookie;

  if (partnerAccessToken) {
    try {
      await ctx.invoke.wake.actions.cart.partnerAssociate({
        partnerAccessToken,
      });
    } catch (e) {
      logger.error(e);
    }
  }

  const hotsiteUrlBeuty = url.pathname
    .replace(/\/c$/, "")
    .replace(/^/, "/beleza-e-saude");

  const urlDataBeuty = await storefront.query<
    GetUrlQuery,
    GetUrlQueryVariables
  >(
    {
      variables: {
        url: hotsiteUrlBeuty,
      },
      ...GetURL,
    },
    {
      headers,
    },
  );

  const hotsiteUrl = url.pathname
    ?.replace(/\/c$/, "")
    ?.replace(/^/, "/medicamentos");

  const urlData = await storefront.query<GetUrlQuery, GetUrlQueryVariables>(
    {
      variables: {
        url: hotsiteUrl,
      },
      ...GetURL,
    },
    {
      headers,
    },
  );

  const isProductGeneric = query?.includes("generico-do");
  const isProductSimliar = query?.includes("similar-do");
  const queryProduct = isProductGeneric
    ? query?.replace("generico-do-", "")
    : isProductSimliar
    ? query?.replace("similar-do-", "")
    : query;

  const categorySlug = url?.pathname?.replace(/\/c$/, "")?.replace("/", "");

  const substance = await getSubstance(query);
  const therapeuticClass = await getTherapeuticClass(
    query?.toLocaleLowerCase(),
  );

  const disease = await getDisease(query);
  const categoryMain = await getCategoryForSlus([categorySlug]);

  const categoryId = (categoryMain?.items?.length ?? 0) > 0
    ? categoryMain?.items[0]?.wakeId
    : 0;

  let compositionKey = "";
  let nameProduct = "";

  if (isProductGeneric || isProductSimliar) {
    const productData =
      (await storefront.query<SearchQuery, SearchQueryVariables>(
        {
          variables: {
            filters: [
              {
                field: "Tipo do produto",
                values: ["Medicamento"],
              },
            ],
            query: queryProduct,
            operation: "AND",
            limit: 1,
            ignoreDisplayRules: true,
            maximumPrice: 0.1,
          },
          ...Search,
        },
        {
          headers,
        },
      )) ?? [];

    const products = productData?.result?.productsByOffset?.items;

    compositionKey = products && products?.length > 0
      ? products[0]?.attributes?.find((att) => att?.name == "Princípio ativo")
        ?.value ?? ""
      : "";

    nameProduct = products && products?.length > 0
      ? products[0]?.productName ?? queryProduct?.replace(/-/g, " ")
      : queryProduct?.replace(/-/g, " ");
  }

  const isHotsite = urlData.uri?.kind === "HOTSITE" ||
    urlDataBeuty.uri?.kind === "HOTSITE";

  let urlCategory = null;

  if (!isHotsite && categoryId) {
    const { categories } = await storefront.query<
      GetCategoryProductsQuery,
      GetCategoryProductsQueryVariables
    >(
      {
        variables: {
          categoryId: Number(categoryId),
        },
        ...GetCategory,
      },
      {
        headers,
      },
    );

    urlCategory = categories?.nodes.length > 0
      ? categories?.nodes[0]?.hotsiteUrl
      : null;
  }

  // console.log(hotsiteUrlBeuty);
  const filterAtt = substance
    ? [
      {
        field: "Princípio Ativo",
        values: [substance?.substanceName],
      },
    ]
    : therapeuticClass
    ? [
      {
        field: "Classe terapêutica",
        values: [therapeuticClass?.therapeuticClassName],
      },
    ]
    : isProductGeneric
    ? [
      {
        field: "Princípio Ativo",
        values: [compositionKey ?? ""],
      },
      {
        field: "Tipo do medicamento",
        values: ["Genérico"],
      },
    ]
    : isProductSimliar
    ? [
      {
        field: "Princípio Ativo",
        values: [compositionKey ?? ""],
      },
      {
        field: "Tipo do medicamento",
        values: ["Similar"],
      },
    ]
    : disease
    ? [
      {
        field: "Doença",
        values: [disease?.diseaseName ?? ""],
      },
    ]
    : [];

  const commonParams = {
    sortDirection,
    filters: [...filterAtt, ...filters],
    limit: Math.min(limit, MAXIMUM_REQUEST_QUANTITY),
    offset,
    onlyMainVariant,
    maximumPrice: 0.1,
  };

  if (!query && !isHotsite && !partnerAccessToken && !urlCategory) return null;

  let data;
  data = isHotsite
    ? await storefront.query<HotsiteQuery, HotsiteQueryVariables>(
      {
        variables: {
          ...commonParams,
          sortKey,
          url: urlData.uri?.kind === "HOTSITE" ? hotsiteUrl : hotsiteUrlBeuty,
          limit,
        },
        ...Hotsite,
      },
      {
        headers,
      },
    )
    : !!categoryId && !!urlCategory
    ? await storefront.query<HotsiteQuery, HotsiteQueryVariables>(
      {
        variables: {
          ...commonParams,
          sortKey,
          url: urlCategory,
          limit,
        },
        ...Hotsite,
      },
      {
        headers,
      },
    )
    : await storefront.query<SearchQuery, SearchQueryVariables>(
      {
        variables: {
          ...commonParams,
          query: substance ||
              therapeuticClass ||
              isProductGeneric ||
              isProductSimliar ||
              disease
            ? " "
            : query,
          operation: "AND",
          limit,
          maximumPrice: 0.1,
        },
        ...Search,
      },
      {
        headers,
      },
    );

  if ((data?.result?.productsByOffset?.totalCount ?? 0) < 1) {
    data = await storefront.query<SearchQuery, SearchQueryVariables>(
      {
        variables: {
          query: query,
          operation: "OR",
          limit,
          sortKey,
          filters: isProductGeneric
            ? [
              {
                field: "Tipo do medicamento",
                values: ["Genérico"],
              },
            ]
            : isProductSimliar
            ? [
              {
                field: "Tipo do medicamento",
                values: ["Similar"],
              },
            ]
            : [],
          maximumPrice: 0.1,
        },
        ...Search,
      },
      {
        headers,
      },
    );
  }

  const products = data?.result?.productsByOffset?.items ?? [];

  const nextPage = new URLSearchParams(url.searchParams);
  const previousPage = new URLSearchParams(url.searchParams);

  const hasNextPage = data?.result?.productsByOffset?.totalCount !== 10000
    ? Boolean(
      (data?.result?.productsByOffset?.totalCount ?? 0) / limit >
        (data?.result?.productsByOffset?.page ?? 0),
    )
    : Boolean(
      (data?.result?.productsByOffset?.totalCount - limit ?? 0 ?? 0) /
          limit >
        (data?.result?.productsByOffset?.page ?? 0),
    );

  const hasPreviousPage = page > 1;

  const pageOffset = props.pageOffset ?? 0;

  if (hasNextPage) {
    nextPage.set(
      "pagina",
      (page == 0 ? page + pageOffset + 1 : page + 1).toString(),
    );
  }

  if (hasPreviousPage) {
    previousPage.set("pagina", (page - 1).toString());
  }

  const productIDs = products.map((i) => i?.productId);

  const variations = props.getVariations
    ? await getVariations(storefront, productIDs, headers, url)
    : [];

  const terms = await getTerms(query);

  const breadcrumb = toBreadcrumbList(
    data?.result?.breadcrumbs
      ?.slice(1)
      ?.filter(
        (item): item is { text: string; link: string } =>
          item !== null &&
          typeof item?.text === "string" &&
          typeof item?.link === "string",
      )
      ?.map(({ text, link }) => ({
        text: text === " "
          ? substance
            ? substance?.substanceName
            : disease
            ? disease?.diseaseName
            : therapeuticClass
            ? `${therapeuticClass?.therapeuticClassName}`
            : ""
          : isProductGeneric
          ? terms
            ? terms?.title
            : `Genérico do ${queryProduct?.replace(/-/g, " ")}`
          : isProductSimliar
          ? terms
            ? terms?.title
            : `Similar do ${queryProduct?.replace(/-/g, " ")}`
          : text,
        link: disease
          ? `/doenca/${disease?.slug}`
          : therapeuticClass
          ? `/b/${therapeuticClass.slug?.replace("-root", "")}`
          : terms
          ? `/b/${terms?.termValue}`
          : isProductGeneric || isProductSimliar || substance
          ? url.href
          : link.includes("busca?busca")
          ? link.replace("busca?busca=", "")
          : link.replace("/medicamentos", "").replace("/beleza-e-saude", "") +
            "/c",
      })),
    { base: url },
  );

  const category = await getCategory(url.pathname.replace(/^\/|\/c$/g, ""));

  const titleRender = terms
    ? terms.title || `${query?.replace(/-/g, " ")}`
    : substance
    ? `${substance.substanceName}`
    : therapeuticClass
    ? `${therapeuticClass.therapeuticClassName}`
    : isProductGeneric
    ? terms ? terms.title : `Genérico do ${queryProduct?.replace(/-/g, " ")}`
    : isProductSimliar
    ? terms ? terms.title : `Similar do ${queryProduct?.replace(/-/g, " ")}`
    : category?.items?.length > 0
    ? category?.items[0]?.titleH1
    : disease
    ? disease?.titleH1 ?? `${query?.replace(/-/g, " ")}`
    : `${query?.replace(/-/g, " ")}`;

  const title = isHotsite
    ? (data as HotsiteQuery)?.result?.seo?.find((i) => i?.type === "TITLE")
      ?.content ??
      `${
        category?.items[0]?.categorySeo ||
        category?.items[0]?.titleH1 ||
        category?.items[0]?.categoryName
      }: compre com menor preço | CR`
    : `${titleRender}: encontre as melhores ofertas | CR`;

  const description = isHotsite
    ? (data as HotsiteQuery)?.result?.seo?.find(
      (i) => i?.name === "description",
    )?.content
    : `Encontre ofertas de ${titleRender} na Consulta Remédios. Compare preço de diversas lojas e economize em ${titleRender}!`;
  const canonical = new URL(
    isHotsite ? `${url.pathname}${page == 0 ? "" : `?pagina=${page}`}` : url,
    url,
  ).href;

  const filterCategory = data?.result?.aggregations?.filters?.find(
    (filter) => filter?.field === "Categoria",
  );

  const categoryChildren = isHotsite
    ? await storefront.query<
      GetCategoryChildrens,
      GetCategoryChildrenVariables
    >(
      {
        variables: {
          urls: [
            urlData.uri?.kind === "HOTSITE" ? hotsiteUrl : hotsiteUrlBeuty,
          ],
          first: 50,
        },
        ...GetCategoryChildren,
      },
      {
        headers,
      },
    )
    : null;

  const names =
    filterCategory?.values?.flatMap((item) => item?.name ? [item.name] : []) ??
      null;
  const categoryThumbs = categoryChildren &&
      (categoryChildren?.categories?.nodes?.[0]?.children?.length ?? 0) > 0
    ? await getCategoryThumbs(
      categoryChildren?.categories?.nodes?.[0]?.children.map(
        (child) => child.name,
      ),
    )
    : await getCategoryThumbs(names);

  const slugCategory = isHotsite
    ? hotsiteUrl.replace("/medicamentos/", "").replace("/beleza-e-saude", "")
    : query;

  const getSlugDepth = (slug: string) =>
    slug?.split("/")?.filter(Boolean).length;

  const baseDepth = getSlugDepth(slugCategory);

  const categoryThumbsFiltered: CategoryThumb[] | null = isHotsite
    ? (categoryThumbs?.items?.filter((item: CategoryThumb) => {
      const itemDepth = getSlugDepth(item.slug);
      return (
        item?.slug.startsWith(slugCategory) &&
        item?.slug !== slugCategory &&
        itemDepth === baseDepth + 1
      );
    }) as CategoryThumb[] | null)
    : (categoryThumbs?.items
      ?.filter((item: CategoryThumb) => {
        return (
          item?.slug !== "medicamentos" && item?.slug !== "beleza-e-saude"
        );
      })
      ?.slice(0, 12) as CategoryThumb[] | null);

  return {
    "@type": "ProductListingPage",
    filters: toFilters(data?.result?.aggregations, { base: url }),
    pageInfo: {
      nextPage: hasNextPage ? `?${nextPage}` : undefined,
      previousPage: hasPreviousPage ? `?${previousPage}` : undefined,
      currentPage: data?.result?.productsByOffset?.page ?? 1,
      records: data?.result?.productsByOffset?.totalCount,
      recordPerPage: limit,
    },
    sortOptions: SORT_OPTIONS,
    breadcrumb,
    seo: {
      description: category
        ? category?.items[0].metaDescription
          ? category?.items[0].metaDescription
          : `Ofertas de ${
            category?.items[0]?.titleH1 || category?.items[0]?.categoryName
          } com os Melhores Preços. Compre produtos na Consulta Remédios com menor preço e receba no mesmo dia!`
        : description ?? "",
      title: category
        ? category?.items[0].metaTitle
          ? category?.items[0].metaTitle
          : `${
            category?.items[0]?.titleH1 || category?.items[0]?.categoryName
          }: compre com menor preço | CR`
        : title ?? "",
      canonical,
      noIndexing: isHotsite && products.length > 0
        ? false
        : !isHotsite && terms
        ? false
        : !!categoryId && !!urlCategory && products.length > 0
        ? false
        : true,
    },
    titlePage: terms
      ? terms.title
      : substance
      ? `${substance.substanceName}`
      : therapeuticClass
      ? `${therapeuticClass.therapeuticClassName}`
      : isProductGeneric
      ? terms ? terms.title : `Genérico do ${queryProduct?.replace(/-/g, " ")}`
      : isProductSimliar
      ? terms ? terms.title : `Similar do ${queryProduct?.replace(/-/g, " ")}`
      : category?.items?.length > 0
      ? category?.items[0]?.titleH1
      : disease
      ? disease?.titleH1 ?? `${query?.replace(/-/g, " ")}`
      : null,
    descriptionPage: terms ? terms.shortDescription : null,
    thumbmails: categoryThumbsFiltered
      ? categoryThumbsFiltered?.sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
      )
      : undefined,
    categoryContent: category ? category.items[0] : null,
    products: products
      ?.filter((p): p is ProductFragment => Boolean(p))
      .map((variant) => {
        const productVariations = variations?.filter(
          (v) => v.inProductGroupWithID === variant.productId,
        );

        return toProduct(variant, { base: url }, productVariations);
      }),
    prescriptionType: substance?.prescriptionType
      ? substance?.prescriptionType
      : null,
    relatedTerms: terms?.relatedTermTitles ? terms?.relatedTermTitles : null,
    isHotsite: isHotsite,
    filtersActive: filters.flatMap((item) => item.values),
  };
};

export default searchLoader;
