import type { Product } from "../commerce/types.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { AppContext } from "apps/wake/mod.ts";
import { MAXIMUM_REQUEST_QUANTITY } from "apps/wake/utils/getVariations.ts";
import { GetBuyList, GetProduct } from "../utils/graphql/queries.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import {
  BuyListQuery,
  BuyListQueryVariables,
  GetProductQuery,
  GetProductQueryVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { getPartnerCookie } from "apps/wake/utils/partner.ts";
import { toProduct } from "../utils/transform.ts";

export interface Props {
  id: number;
}

/**
 * @title Wake Integration
 * @description Product Details Page loader
 */
async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Product | null> {
  const url = new URL(req.url);
  const { id } = props;

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const partnerAccessToken = getPartnerCookie(req.headers);

  const headers = parseHeaders(req.headers);

  if (!id) return null;

  const variantId = Number(url.searchParams.get("skuId")) || null;

  if (!id) {
    throw new Error("Missing product id");
  }

  const { buyList: wakeBuyList } = await storefront.query<
    BuyListQuery,
    BuyListQueryVariables
  >(
    {
      variables: { id: id, partnerAccessToken },
      ...GetBuyList,
    },
    {
      headers,
    },
  );

  const { product: wakeProduct } = await storefront.query<
    GetProductQuery,
    GetProductQueryVariables
  >(
    {
      variables: {
        productId: id,
        partnerAccessToken,
      },
      ...GetProduct,
    },
    {
      headers,
    },
  );

  const wakeProductOrBuyList = wakeProduct || wakeBuyList;

  if (!wakeProductOrBuyList) {
    return null;
  }

  const variantsItems = (await ctx.invoke.wake.loaders.productList({
    first: MAXIMUM_REQUEST_QUANTITY,
    sortDirection: "ASC",
    sortKey: "RANDOM",
    filters: { productId: [id] },
  })) ?? [];

  const product = toProduct(
    wakeProductOrBuyList,
    { base: url },
    variantsItems,
    variantId,
  );

  return product;
}

export default loader;
