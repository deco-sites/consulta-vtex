import type { Product } from "../commerce/types.ts";
import type { AppContext } from "apps/wake/mod.ts";
import { getVariations } from "apps/wake/utils/getVariations.ts";
import { GetProducts } from "../utils/graphql/queries.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import {
  GetProductsQuery,
  GetProductsQueryVariables,
  ProductFragment,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { toProduct } from "../utils/transform.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";

export interface StockFilter {
  dcId?: number[];
  /** @description The distribution center names to match. */
  dcName?: string[];
  /**
   * @title Stock greater than or equal
   * @description The product stock must be greater than or equal to.
   */
  stock_gte?: number;
  /**
   * @title Stock less than or equal
   * @description The product stock must be lesser than or equal to.
   */
  stock_lte?: number;
}

export interface PriceFilter {
  /**
   * @title Discount greater than
   * @description The product discount must be greater than or equal to.
   */
  discount_gte?: number;
  /**
   * @title Discount lesser than
   * @description The product discount must be lesser than or equal to.
   */
  discount_lte?: number;
  /** @description Return only products where the listed price is more than the price. */
  discounted?: boolean;
  /**
   *  @title Price greater than
   *  @description The product price must be greater than or equal to.
   */
  price_gte?: number;
  /**
   * @title Price lesser than
   * @description The product price must be lesser than or equal to. */
  price_lte?: number;
}

export interface Filters {
  /** @description The set of attributes to filter. */
  attributes?: {
    id?: string[];
    name?: string[];
    type?: string[];
    value?: string[];
  };
  /** @description Choose if you want to retrieve only the available products in stock. */
  available?: boolean;
  /** @description The set of brand IDs which the result item brand ID must be included in. */
  brandId?: number[];
  /** @description The set of category IDs which the result item category ID must be included in. */
  categoryId?: number[];
  /** @description The set of EANs which the result item EAN must be included. */
  ean?: string[];
  /** @description Retrieve the product variant only if it contains images. */
  hasImages?: boolean;
  /** @description Retrieve the product variant only if it is the main product variant. */
  mainVariant?: boolean;

  /** @description The set of prices to filter. */
  prices?: PriceFilter;

  /** @description The product unique identifier (you may provide a list of IDs if needed). */
  productId?: number[];
  /** @description The product variant unique identifier (you may provide a list of IDs if needed). */
  productVariantId?: number[];
  /** @description A product ID or a list of IDs to search for other products with the same parent ID. */
  sameParentAs?: number[];
  /** @description The set of SKUs which the result item SKU must be included. */
  sku?: string[];
  /**
   *  @title Stock greater than
   *  @description Show products with a quantity of available products in stock greater than or equal to the given number. */
  stock_gte?: number;
  /**
   * @title Stock lesser than
   * @description Show products with a quantity of available products in stock less than or equal to the given number. */
  stock_lte?: number;
  /** @description The set of stocks to filter. */
  stocks?: StockFilter;
  /**
   * @title Upated after
   * @format date
   * @description Retrieve products which the last update date is greater than or equal to the given date.
   */
  updatedAt_gte?: string;
  /**
   * @title Upated before
   * @format date
   * @description Retrieve products which the last update date is less than or equal to the given date.
   */
  updatedAt_lte?: string;
}

export interface Props {
  /**
   * @title Count
   * @description Number of products to return
   * @maximum 50
   * @default 12
   */
  first: number;
  sortDirection: "ASC" | "DESC";
  sortKey:
    | "DISCOUNT"
    | "NAME"
    | "PRICE"
    | "RANDOM"
    | "RELEASE_DATE"
    | "SALES"
    | "STOCK";

  filters: Filters;

  /** @description Retrieve variantions for each product. */
  getVariations?: boolean;

  slug?: RequestURLParam;
  product: RequestURLParam;
}

interface ExternalProductResponse {
  id?: string;
  categoryName?: string;
  path?: string;
  slug?: string;
  mainCategory?: string;
}

const fetchExternalProduct = async (
  link: string,
  slug: string = "",
  type: "product" | "variation" = "product",
): Promise<ExternalProductResponse | null> => {
  try {
    const url = type === "variation"
      ? `https://auxiliarapi.consultaremedios.com.br/Variation/_slug/${link}/${slug}`
      : `https://auxiliarapi.consultaremedios.com.br/Product/_slug/${link}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization:
          "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Erro ao consultar a api: ${response.status} - ${response.statusText}`,
      );
      return null;
    }

    const data = await response.json();

    let productCategories;

    if (type === "variation") {
      productCategories = data.product?.productCategory;

      if (!productCategories) {
        console.warn(
          "⚠️ Estrutura da Variation API não tem product.productCategory:",
          data,
        );
        return null;
      }
    } else {
      productCategories = data.productCategory;
    }

    const mainCategory = productCategories?.find(
      (cat: any) => cat.mainCategory === true,
    );

    if (!mainCategory) {
      return null;
    }

    const categorySlug = mainCategory.category?.slug;
    const categoryPath = mainCategory.category?.path;

    const categoryName = mainCategory.category?.categoryName;

    if (!categorySlug || !categoryPath) {
      console.warn("⚠️ Dados incompletos (faltando slug ou path):", data);
      return null;
    }

    // console.log('✅ Produto com mainCategory=true encontrado:', {
    //   slug: categorySlug,
    //   path: categoryPath,
    //   categoryName: categoryName,
    //   mainCategory: mainCategory
    // });
    const updateData = {
      slug: categorySlug,
      path: categoryPath,
      categoryName: categoryName,
      mainCategory: mainCategory,
    };

    return updateData;
  } catch (error) {
    console.log("Erro ao fazer a requisição", error);
    return null;
  }
};

const fetchCategoryIdFromSlug = async (
  slug: string,
  path: string,
): Promise<number | null> => {
  try {
    const firstWord = path
      .split(">")
      .map((p: string) => p.trim())[0]
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const categoryUrl = `${firstWord}/${slug}`;

    const graphqlQuery = `
      query {
        categories(urls: "${categoryUrl}", first: 10) {
          edges {
            node {
              categoryId
            }
          }
        }
      }
    `;

    const response = await fetch("https://storefront-api.fbits.net/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TCS-Access-Token": "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585",
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    const result = await response.json();

    const categoryId = result?.data?.categories?.edges?.[0]?.node?.categoryId;

    return categoryId || null;
  } catch (error) {
    console.error("Erro ao consultar categoria GraphQL:", error);
    return null;
  }
};

/**
 * @title Wake Integration
 * @description Product List loader
 */
const productListRecommendationLoader = async (
  props: Props,
  req: Request,
  _ctx: AppContext,
): Promise<Product[] | null> => {
  const url = new URL(req.url);

  const product = url.pathname.split("/")[1];

  const productSlug = url.pathname.split("/")[2];

  const headers = parseHeaders(req.headers);

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  let externalProductData: ExternalProductResponse | null = null;
  let categoryId: number | null = null;

  if (product || productSlug) {
    const productGeneral = product;

    const slugGeneral = productSlug;

    if (slugGeneral && slugGeneral !== "p") {
      externalProductData = await fetchExternalProduct(
        productGeneral,
        slugGeneral,
        "variation",
      );
    } else {
      externalProductData = await fetchExternalProduct(
        productGeneral,
        "",
        "product",
      );
    }

    if (externalProductData?.slug && externalProductData?.path) {
      categoryId = await fetchCategoryIdFromSlug(
        externalProductData.slug,
        externalProductData.path,
      );
    }
  }

  if (!categoryId) {
    console.warn("Nenhum categoryId encontrado");
    return null;
  }

  const finalFilters: Filters = {
    ...props.filters,
    categoryId: [categoryId],
  };

  if (categoryId) {
    finalFilters.categoryId = [categoryId];
  }

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const data = await storefront.query<
    GetProductsQuery,
    GetProductsQueryVariables
  >(
    {
      variables: { ...props, partnerAccessToken: token, filters: finalFilters },
      ...GetProducts,
    },
    {
      headers,
    },
  );

  const products = data.products?.nodes;

  if (!Array.isArray(products)) {
    return null;
  }

  const productIDs = products.map((i) => i?.productId);

  const variations = props.getVariations
    ? await getVariations(storefront, productIDs, headers, url)
    : [];

  const transformedProducts = products
    .filter((node): node is ProductFragment => Boolean(node))
    .map((node) => {
      const productVariations = variations?.filter(
        (v) => v.inProductGroupWithID === node.productId,
      );

      return toProduct(node, { base: url }, productVariations);
    });

  return transformedProducts;
};

export default productListRecommendationLoader;
