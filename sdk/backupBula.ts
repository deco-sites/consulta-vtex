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
  GetProductsQuery,
  GetProductsQueryVariables,
  InputMaybe,
  Operation,
  ProductFilterInput,
  ProductFragment,
  Scalars,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { GetProduct, GetProducts } from "../utils/graphql/queries.ts";
import { toBreadcrumbList, toProduct } from "../utils/transform.ts";
import { getCategoryThumbs } from "../sdk/getCategory.ts";

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

  const headers = parseHeaders(req.headers);

  const validateSlug = slug !== product;

  async function searchProductVariants(
    product: string,
    slug?: string,
    validateSlug?: boolean,
  ) {
    const maxAttempts = 5;
    let attempt = 0;
    let data = null;

    const half = Math.floor(product?.length / 2);
    const halfProduct = product?.length > 8
      ? product.slice(0, half).replace(/-/g, " ")
      : null;

    const queries = [
      () => product,
      () =>
        `${product?.replace(/-/g, " ")} ${
          validateSlug && slug ? slug.replace(/-/g, " ") : ""
        }`,
      () => `${product?.replace(/-/g, " ")}/p`,
      () => `${product?.replace(/-/g, " ")} /p`,
      () => halfProduct,
    ].filter(Boolean);

    const urlPath = `/${product}${slug ? `/${slug}/p` : ""}`;

    let allItems = [];

    while (attempt < maxAttempts) {
      if (attempt >= queries.length) break;

      const queryString = queries[attempt]();

      data = await storefront.query<SearchQuery, SearchQueryVariables>(
        {
          variables: {
            query: queryString,
            operation: "AND",
            limit: 50,
            ignoreDisplayRules: false,
            maximumPrice: 0.1,
          },
          ...Search,
        },
        { headers },
      );

      const items = data?.result?.productsByOffset?.items ?? [];
      allItems.push(...data?.result?.productsByOffset?.items);
      const productResultValidate = items.find(
        (item) =>
          item.spotInformation
            ?.replace("https://consultaremedios.com.br", "")
            ?.includes(product) &&
          !item?.attributes.find((item) => item.name == "Slug Principal"),
      );
      if (productResultValidate) {
        break;
      }

      attempt++;
    }

    const productResult = allItems.find(
      (item) =>
        item.spotInformation?.replace("https://consultaremedios.com.br", "") ===
          urlPath,
    );

    const productResultValidate = allItems.find(
      (item) =>
        item.spotInformation
          ?.replace("https://consultaremedios.com.br", "")
          ?.includes(product) &&
        !item?.attributes.find((item) => item.name == "Slug Principal"),
    );

    const productId = Number(
      productResult?.productId ?? productResultValidate?.productId,
    );

    const variantId = Number(
      productResult?.productVariantId ??
        productResultValidate?.productVariantId,
    );

    return {
      data,
      productId,
      variantId,
      productResult: productResult || productResultValidate,
    };
  }

  const { productId } = await searchProductVariants(
    product,
    slug,
    validateSlug,
  );

  console.log(productId);

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

  if (!wakeProduct) {
    return null;
  }

  const canonicalProduct = toProduct(wakeProduct, { base: url });

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
      ...canonicalProduct,
    },
    seo: {
      canonical: canonicalProduct.isVariantOf?.url ?? "",
      title: wakeProduct?.productName ?? "",
      description:
        wakeProduct?.seo?.find((m) => m?.name === "description")?.content ?? "",
    },
  };
}

export const cache = {
  maxAge: 60 * 60 * 24,
};

export const cacheKey = (props: Props, req: Request, _ctx: AppContext) => {
  const url = new URL(req.url);
  const { product, slug } = props;
  const urlPath = `${product}${slug !== product ? `/${slug}/bula` : "/bula"}`;

  const params = new URLSearchParams([["slug", urlPath ?? ""]]);

  url.search = params.toString();

  return url.href;
};
