import { fetchSafe } from "apps/utils/fetch.ts";
import { AppContext } from "../apps/site.ts";
import { AppContext as WakeAppContext } from "apps/wake/mod.ts";
import { createGraphqlClient, gql } from "apps/utils/graphql.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import type { DetailsPageLeaflet } from "../commerce/types.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import {
  GetProductQuery,
  GetProductQueryVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { GetProduct } from "../utils/graphql/queries.ts";
import { toBreadcrumbList, toProduct } from "../utils/transform.ts";
import { getCategoryThumbs } from "../sdk/getCategory.ts";
import { contentProductMain } from "../sdk/contentProductMain.ts";

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

export default async function ProductDetailsPage(
  props: Props,
  req: Request,
  _ctx: AppContext & WakeAppContext,
): Promise<DetailsPageLeaflet | null> {
  const url = new URL(req.url);

  const { product, slug } = props;
  console.log("slug", product, slug);
  const ulrPath = product || slug;
  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const headers = parseHeaders(req.headers);

  const productMainContent = await contentProductMain({ product: ulrPath! });

  const productMainApi = productMainContent?.variation?.find(
    (product) => product.wakeProductId,
  );
  const productId = Number(productMainApi?.wakeProductId);

  if (!productId && productMainContent?.substance) {
    return {
      "@type": "ProductDetailsPage",
      productMainContent: productMainContent ? productMainContent : null,
    };
  }

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
    productMainContent: productMainContent ? productMainContent : null,
  };
}

// export const cache = {
//   maxAge: 60 * 60 * 24,
// };
// test sem cache
// export const cacheKey = (props: Props, req: Request, _ctx: AppContext) => {
//   const url = new URL(req.url);
//   const { product } = props;
//   const urlPath = `${product}/bula`;

//   const params = new URLSearchParams([["slug", urlPath ?? ""]]);

//   url.search = params.toString();

//   return url.href;
// };
