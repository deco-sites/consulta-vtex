import type { ProductListingPage } from "../commerce/types.ts";
import { SortOption } from "apps/commerce/types.ts";
import { capitalize } from "apps/utils/capitalize.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import type { AppContext } from "apps/wake/mod.ts";
import {
  getVariations,
  MAXIMUM_REQUEST_QUANTITY,
} from "apps/wake/utils/getVariations.ts";
import { GetPartners, Search } from "../utils/graphql/queries.ts";
import {
  GetPartnersQuery,
  GetPartnersQueryVariables,
  ProductFragment,
  ProductSortKeys,
  SearchQuery,
  SearchQueryVariables,
  SortDirection,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { getPartnerCookie } from "apps/wake/utils/partner.ts";
import { FILTER_PARAM, toFilters, toProduct } from "../utils/transform.ts";
import { Filters } from "apps/wake/loaders/productList.ts";
import { logger } from "@deco/deco/o11y";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { getCategoryThumbs } from "../sdk/getCategory.ts";
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

  nameAttribute: string;

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

    if (!OUTSIDE_ATTRIBUTES_FILTERS.includes(field)) {
      filters.push({ field, values: [val] });
    }
  });

  return filters;
};

/**
 * @title Wake Integration
 * @description Product Listing Page loader
 */
const productListingPageAtributes = async (
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

  const limit = Number(url.searchParams.get("tamanho") ?? props.limit ?? 24);

  const filters = filtersFromParams(url.searchParams) ?? props.filters;
  const sort = (url.searchParams.get("sort") as SortValue | null) ??
    (url.searchParams.get("ordenacao") as SortValue | null) ??
    props.sort ??
    "SALES:DESC";

  const page = props.page ?? Number(url.searchParams.get("pagina")) ?? 0;

  const query = " ";
  const operation = props.operation ?? "AND";

  const queryBrand =
    url.pathname?.replace(/\/marca/g, "")?.replace(/\//g, "") ?? "";

  const urlPromisse =
    `https://auxiliarapi.consultaremedios.com.br/Brand/_slug/${queryBrand}`;
  const headersBrand = {
    Authorization:
      "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
    "Content-Type": "application/json",
  };

  const responseBrand = async () => {
    try {
      const response = await fetch(urlPromisse, {
        method: "GET",
        headers: headersBrand,
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (_error) {
      return null;
    }
  };

  const brand = await responseBrand();

  const [sortKey, sortDirection] = sort.split(":") as [
    ProductSortKeys,
    SortDirection,
  ];

  const onlyMainVariant = props.onlyMainVariant ?? true;
  const [minimumPrice, maximumPrice] = url.searchParams
    .getAll("filtro")
    ?.find((i) => i.startsWith("precoPor"))
    ?.split(":")[1]
    ?.split(";")
    .map(Number) ??
    url.searchParams.get("precoPor")?.split(";").map(Number) ??
    [];

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

  console.log(props?.nameAttribute);

  const commonParams = {
    sortDirection,
    sortKey,
    filters: [
      {
        field: props?.nameAttribute ?? " ",
        values: [brand?.brandName],
      },
      ...filters,
    ],
    limit: Math.min(limit, MAXIMUM_REQUEST_QUANTITY),
    offset,
    onlyMainVariant,
    maximumPrice: 0.1,
  };

  if (!brand) {
    return null;
  }

  if (!query && !partnerAccessToken) return null;

  const data = await storefront.query<SearchQuery, SearchQueryVariables>(
    {
      variables: {
        ...commonParams,
        operation,
        maximumPrice: 0.1,
      },
      ...Search,
    },
    {
      headers,
    },
  );

  const products = data?.result?.productsByOffset?.items ?? [];

  const nextPage = new URLSearchParams(url.searchParams);
  const previousPage = new URLSearchParams(url.searchParams);

  const hasNextPage = Boolean(
    (data?.result?.productsByOffset?.totalCount ?? 0) / limit >
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

  const title =
    `Produtos ${brand?.brandName} com menor preço e onde comprar | CR`;
  const description =
    `Encontre produtos ${brand?.brandName} com menor preço, compre online e receba onde quiser. Economize em produtos de beleza e saúde com a CR!`;
  const canonical = new URL(url, url).href;

  const filterCategory = data?.result?.aggregations?.filters?.find(
    (filter) => filter?.field === "Categoria",
  );
  const names =
    filterCategory?.values?.flatMap((item) => item?.name ? [item.name] : []) ??
      null;
  const categoryThumbs = await getCategoryThumbs(names);

  const aggregations = data?.result?.aggregations?.filters?.filter(
    (item) => item?.field !== "Marca",
  );

  return {
    "@type": "ProductListingPage",
    filters: data?.result?.aggregations
      ? toFilters(
        {
          ...data?.result?.aggregations,
          filters: aggregations,
        },
        { base: url },
      )
      : [],
    pageInfo: {
      nextPage: hasNextPage ? `?${nextPage}` : undefined,
      previousPage: hasPreviousPage ? `?${previousPage}` : undefined,
      currentPage: data?.result?.productsByOffset?.page ?? 1,
      records: data?.result?.productsByOffset?.totalCount,
      recordPerPage: limit,
    },
    sortOptions: SORT_OPTIONS,
    breadcrumb: {
      "@type": "BreadcrumbList",
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          name: "Marcas",
          position: 1,
          item: `${url.origin}/marcas`,
        },
        {
          "@type": "ListItem",
          name: brand?.brandName ?? "",
          position: 2,
          item: `${url.origin}/marca/${brand?.slug}`,
        },
      ],
    },
    seo: {
      description: description || "",
      title: title || "",
      canonical,
    },
    thumbmails: categoryThumbs ? categoryThumbs.items : null,
    products: products
      ?.filter((p): p is ProductFragment => Boolean(p))
      .map((variant) => {
        const productVariations = variations?.filter(
          (v) => v.inProductGroupWithID === variant.productId,
        );

        return toProduct(variant, { base: url }, productVariations);
      }),
    filtersActive: filters.flatMap((item) => item.values),
  };
};

export default productListingPageAtributes;
