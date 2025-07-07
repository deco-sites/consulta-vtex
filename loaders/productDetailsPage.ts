import { fetchSafe } from "apps/utils/fetch.ts";
import { AppContext } from "../apps/site.ts";
import { AppContext as WakeAppContext } from "apps/wake/mod.ts";
import { createGraphqlClient, gql } from "apps/utils/graphql.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import type { Product, ProductDetailsPage } from "../commerce/types.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import {
  Exact,
  GetProductQuery,
  GetProductQueryVariables,
  InputMaybe,
  Operation,
  ProductFilterInput,
  ProductFragment,
  ProductPageQuery,
  ProductPageQueryVariables,
  Scalars,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { GetProduct, GetProductPage } from "../utils/graphql/queries.ts";
import { contentProductMain } from "../sdk/contentProductMain.ts";
import { toBreadcrumbList, toProduct } from "../utils/transform.ts";
import { redirect } from "@deco/deco";
import { getCategoryThumbs } from "../sdk/getCategory.ts";
import { contentProduct } from "../sdk/contentProduct.ts";

export interface Props {
  slug?: RequestURLParam;
  product: RequestURLParam;
}

interface Category {
  id: number;
  statusId: number;
  categoryId: number;
  categoryName: string;
  path: string;
  categorySeo: string;
  slug: string;
  description: string;
  titleH1: string | null;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  image: string;
  created: string | null;
  updated: string | null;
}

const Product = gql`
  fragment Product on Product {
    mainVariant
    productName
    productId
    alias
    id
    productVariantId
    parentId
    sku
    variantName
    spotInformation
    available
    attributes {
      value
      name
    }
  }
`;

export const Search = {
  fragments: [Product],
  query: gql`
    query Search(
      $operation: Operation!
      $query: String
      $limit: Int
      $ignoreDisplayRules: Boolean
      $maximumPrice: Decimal
      $filters: [ProductFilterInput]
    ) {
      result: search(
        query: $query
        operation: $operation
        ignoreDisplayRules: $ignoreDisplayRules
      ) {
        productsByOffset(
          limit: $limit
          maximumPrice: $maximumPrice
          filters: $filters
        ) {
          items {
            ...Product
          }
        }
      }
    }
  `,
};

export type SearchQuery = {
  result: {
    productsByOffset: {
      items: Array<{
        mainVariant: boolean;
        productName: string;
        productId: string;
        alias: string;
        id: string;
        productVariantId: string;
        parentId: string | null;
        sku: string;
        variantName: string | null;
        spotInformation: string | null;
        available: boolean;
        attributes: Array<{
          value: string;
          name: string;
        }>;
      }>;
    };
  };
};

export type SearchQueryVariables = Exact<{
  operation: Operation;
  query?: InputMaybe<Scalars["String"]["input"]>;
  limit?: number;
  ignoreDisplayRules?: boolean;
  maximumPrice?: InputMaybe<Scalars["Decimal"]["input"]>;
  filters?: InputMaybe<
    Array<InputMaybe<ProductFilterInput>> | InputMaybe<ProductFilterInput>
  >;
}>;

type RelatedProduct = {
  nome: string;
  id: number;
  alias: string;
  cleanAlias: string;
  priceDifference: number;
  maximumPrice: number;
  minimumPrice: number;
};

export default async function ProductDetailsPage(
  props: Props,
  req: Request,
  ctx: AppContext & WakeAppContext,
): Promise<ProductDetailsPage | null> {
  const url = new URL(req.url);

  const { product, slug } = props;
  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  let productContent = null;
  let productMainContent = null;

  if (slug !== product) {
    productContent = await contentProduct({ slug, product }, req);
  } else {
    productMainContent = await contentProductMain({ product });
  }

  const productMainApi = productMainContent?.variation?.find(
    (product) => product.wakeProductId,
  );

  const productId = Number(productContent?.wakeProductId) ||
    Number(productMainApi?.wakeProductId);

  const headers = parseHeaders(req.headers);

  if (!productId) {
    return null;
  }

  const { product: wakeProduct } = await storefront.query<
    GetProductQuery,
    GetProductQueryVariables
  >(
    {
      variables: {
        productId,
        includeParentIdVariants: true,
      },
      ...GetProduct,
    },
    {
      headers,
    },
  );

  // console.log(wakeProduct, productId);

  // console.log(parentProducts?.products?.nodes?.length);

  if (!wakeProduct) {
    return null;
  }

  const canonicalProduct = toProduct(wakeProduct, { base: url });

  const slugMain = wakeProduct?.attributes?.find(
    (attribute) => attribute?.name === "Slug Principal",
  );

  if (slugMain && `/${slugMain.value}/p` !== url.pathname && slug !== product) {
    const urlPath = new URL(`/${slugMain.value}/p`, url.origin);
    console.log("url 3", url);
    redirect(`${urlPath.href}${url?.search}`, 301);
  }

  const idsSeconds = wakeProduct.attributes?.filter(
    (att) => att?.name === "Ids Secundários",
  );
  const mainCategoryId = wakeProduct?.productCategories?.find(
    (category) => category?.main === true,
  )?.id;

  const compositionKey = canonicalProduct?.additionalProperty?.find(
    (property) => property.name === "CompositionKey" && property.value,
  );

  const breadcrumbFiltered = wakeProduct?.breadcrumbs
    ?.filter((bread) => bread?.text !== "Medicamentos")
    ?.filter((bread) => bread?.text !== "Beleza e Saúde");

  const slugHotsite =
    breadcrumbFiltered && (breadcrumbFiltered?.length ?? 0) > 0
      ? breadcrumbFiltered[0]?.link
      : "";
  const dataProductPage = await storefront.query<
    ProductPageQuery,
    ProductPageQueryVariables
  >(
    {
      variables: {
        filtersParent: wakeProduct?.parentId
          ? { parentId: [Number(wakeProduct?.parentId) ?? 0] }
          : {},
        firstParent: 50,
        sortDirectionParent: "ASC",
        filtersSecondary: {
          productVariantId:
            Array.isArray(idsSeconds) && (idsSeconds?.length ?? 0) > 0
              ? idsSeconds.map((id) => Number(id?.value!))
              : [],
          ignoreDisplayRules: true,
        },
        firstSecondary: 50,
        sortDirectionSecondary: "ASC",
        categoryId: mainCategoryId,
        filtersGenerics: [
          {
            field: "CompositionKey",
            values: [compositionKey?.value ?? ""],
          },
          {
            field: "Tipo do medicamento",
            values: ["Genérico"],
          },
        ],
        queryGenerics: "",
        operationGenerics: "AND",
        limitGenerics: 50,
        ignoreDisplayRulesGenerics: true,
        maximumPriceGenerics: 0.1,
        url: slugHotsite,
        limitRecomendation: 16,
      },
      ...GetProductPage,
    },
    {
      headers,
    },
  );

  const parentProducts = dataProductPage.parentsProducts;

  if (Array.isArray(idsSeconds) && (idsSeconds?.length ?? 0) > 0) {
    const productList = dataProductPage?.productSecondary?.nodes?.map(
      (item) => item,
    );

    const productPromises = (productList?.length ?? 0) > 0 && productList
      ? productList?.map((item) =>
        storefront.query<GetProductQuery, GetProductQueryVariables>(
          {
            variables: {
              productId: Number(item?.productId ?? 0),
              includeParentIdVariants: true,
            },
            ...GetProduct,
          },
          {
            headers,
          },
        )
      )
      : null;
    const responses = productPromises
      ? await Promise.all(productPromises)
      : null;

    const secondaryOffers = responses?.flatMap(
      (res) => res.product?.attributeSelections?.selectedVariant?.offers ?? [],
    );

    const wakeOffers =
      wakeProduct?.attributeSelections?.selectedVariant?.offers ?? [];

    const allOffers = secondaryOffers
      ? [...wakeOffers, ...secondaryOffers]
      : [...wakeOffers];

    if (wakeProduct?.attributeSelections?.selectedVariant) {
      wakeProduct.attributeSelections.selectedVariant.offers = allOffers;
    }
  }

  let relatedProducts: RelatedProduct[] = [];

  if (mainCategoryId) {
    try {
      const currentProductId = Number(productId);

      const products: RelatedProduct[] =
        dataProductPage?.productsCategories?.nodes[0]?.products?.edges
          .map((edge) => {
            const { node } = edge;
            const priceDifference = node.buyBox
              ? Math.abs(node.buyBox.maximumPrice - node.buyBox.minimumPrice)
              : 0;

            const cleanAlias = `${
              node?.spotInformation?.replace(
                "https://consultaremedios.com.br",
                "",
              )
            }`;

            return {
              nome: node.productName,
              id: node.productId,
              alias: node.alias,
              cleanAlias,
              priceDifference,
              maximumPrice: node.buyBox?.maximumPrice || 0,
              minimumPrice: node.buyBox?.minimumPrice || 0,
            };
          })
          // Filtrar o produto atual da lista
          .filter((product) => product.id !== currentProductId) || [];

      // Ordenar produtos e limitar aos top 10

      const newProduct = products
        .filter(
          (product, index, self) =>
            index === self.findIndex((q) => q.nome === product.nome),
        )
        .sort((a, b) => b.priceDifference - a.priceDifference);
      relatedProducts = newProduct.slice(0, 30);
    } catch (error) {
      console.error("Erro ao buscar produtos relacionados:", error);
    }
  }

  if (
    canonicalProduct?.variantsProperty?.length === 0 &&
    slug !== product &&
    (parentProducts?.nodes?.length ?? 0) < 2
  ) {
    console.log("url 2", url);
    const urlPath = new URL(`/${product}/p${url?.search}`, url.origin);
    redirect(`${urlPath.href}${url?.search}`, 301);
  }
  const names = wakeProduct?.breadcrumbs?.map((item) => item?.text!);

  const categoryNames = await getCategoryThumbs(names ?? []);

  const categoryBreadcrumbs: Array<{ text: string; link: string }> =
    categoryNames?.items
      ?.map((category: Category) => {
        return {
          text: category?.titleH1 ?? category?.categoryName,
          link: `/${category?.slug}`,
        };
      })
      .slice()
      .sort(
        (
          a: { text: string; link: string },
          b: { text: string; link: string },
        ) => {
          const slugA = a.link.replace("/", "").toLowerCase();
          const slugB = b.link.replace("/", "").toLowerCase();
          return slugA.localeCompare(slugB);
        },
      );

  const breadcrumbs = categoryBreadcrumbs
    ?.filter((bread) => bread.text !== "Medicamentos")
    ?.filter((bread) => bread.text !== "Beleza e Saúde")
    ?.filter(
      (item): item is { text: string; link: string } =>
        item !== null &&
        typeof item?.text === "string" &&
        typeof item?.link === "string",
    )
    ?.map(({ text, link }) => ({
      text: text,
      link: link.replace("/medicamentos", "").replace("/beleza-e-saude", "") +
        "/c",
    }));

  const isHaveGeneric = canonicalProduct?.additionalProperty?.find(
    (property) => property.name === "Tipo do medicamento" && property.value,
  )?.value === "Referência";

  const genericProducts = dataProductPage?.productsGenerics?.productsByOffset
    ?.items
    ?.filter((product) => product.available)
    ?.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.productName === product.productName),
    );

  const productsRecomendations =
    dataProductPage?.productRecomendations?.productsByOffset?.items ?? [];

  const productVariantIdParams = url.searchParams.get("variant_id");

  const productMain = toProduct(wakeProduct, { base: url });

  return {
    "@type": "ProductDetailsPage",
    breadcrumbList: toBreadcrumbList(
      breadcrumbs ?? [],
      {
        base: url,
      },
      canonicalProduct,
    ),
    product: {
      ...productMain,
    },
    genericProducts: isHaveGeneric ? genericProducts ?? null : null,
    parentProducts: parentProducts?.nodes
      ?.filter((node): node is ProductFragment => Boolean(node))
      .map((node) => {
        return toProduct(node, { base: url });
      }),
    productsRecomendations: {
      head: {
        title: breadcrumbs?.length > 0 ? breadcrumbs[0].text : "",
        href: breadcrumbs?.length > 0 ? breadcrumbs[0].link : "",
      },
      products: productsRecomendations
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
    },
    seo: {
      canonical: canonicalProduct.isVariantOf?.url ?? "",
      title: wakeProduct?.productName ?? "",
      description:
        wakeProduct?.seo?.find((m) => m?.name === "description")?.content ?? "",
    },
    relatedProducts: relatedProducts,
    productVariantIdParams,
    productContent: productContent ? productContent : null,
    productMainContent: productMainContent ? productMainContent : null,
  };
}

export const cache = {
  maxAge: 60 * 60 * 6,
};

export const cacheKey = (props: Props, req: Request, _ctx: AppContext) => {
  const url = new URL(req.url);
  const { product, slug } = props;
  const urlPath = `${product}${slug !== product ? `/${slug}` : ""}`;

  const params = new URLSearchParams([["slug", urlPath ?? ""]]);

  url.search = params.toString();

  return url.href;
};
