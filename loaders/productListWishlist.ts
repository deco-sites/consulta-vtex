import type { Product } from "../commerce/types.ts";
import type { AppContext } from "apps/wake/mod.ts";
import { getVariations } from "apps/wake/utils/getVariations.ts";
import { GetUser } from "../utils/graphql/queries.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import {
  GetUserQuery,
  GetUserQueryVariables,
  SingleProductFragment,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { toProduct } from "../utils/transform.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import authenticate from "../utils/authenticate.ts";

export interface Props {
  /**
   * @title Count
   * @description Number of products to return
   * @maximum 50
   * @default 12
   */
  /** @description Retrieve variantions for each product. */
  getVariations?: boolean;
}

/**
 * @title Wake Integration
 * @description Product List loader
 */
const productListLoader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Product[] | null> => {
  const url = new URL(req.url);

  const headers = parseHeaders(req.headers);

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });
  const customerAccessToken = authenticate(req, ctx);

  if (!customerAccessToken) return null;

  const data = await storefront.query<GetUserQuery, GetUserQueryVariables>(
    {
      variables: { customerAccessToken },
      ...GetUser,
    },
    { headers },
  );

  const products = data.customer?.wishlist?.products;

  if (!Array.isArray(products)) {
    return null;
  }

  const productIDs = products.map((i) => i?.productId);

  const variations = props.getVariations
    ? await getVariations(storefront, productIDs, headers, url)
    : [];

  return products
    .filter((node): node is SingleProductFragment => Boolean(node))
    .map((node) => {
      const productVariations = variations?.filter(
        (v) => v.inProductGroupWithID === node.productId,
      );

      return toProduct(node, { base: url }, productVariations);
    });
};

export default productListLoader;
