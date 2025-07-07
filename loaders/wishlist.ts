import { AppContext } from "apps/wake/mod.ts";
import authenticate from "../utils/authenticate.ts";
import { WishlistAddProduct } from "../utils/graphql/queries.ts";
import { ProductFragment } from "../utils/graphql/storefront.graphql.gen.ts";
import {
  WishlistAddProductMutation,
  WishlistAddProductMutationVariables,
  WishlistReducedProductFragment,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";

export interface Props {
  productId: number;
}

const addItem = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<WishlistReducedProductFragment[] | null> => {
  const { productId } = props;
  const customerAccessToken = authenticate(req, ctx);

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const headers = parseHeaders(req.headers);

  if (!customerAccessToken) return [];

  const data = await storefront.query<
    WishlistAddProductMutation,
    WishlistAddProductMutationVariables
  >(
    {
      variables: { customerAccessToken, productId },
      ...WishlistAddProduct,
    },
    { headers },
  );

  const products = data.wishlistAddProduct;

  if (!Array.isArray(products)) {
    return null;
  }

  return products
    .filter((node): node is ProductFragment => Boolean(node))
    .map(({ productId, productName }) => ({
      productId,
      productName,
    }));
};

export default addItem;
