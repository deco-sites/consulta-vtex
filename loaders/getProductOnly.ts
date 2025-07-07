import type { Product } from "../commerce/types.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { AppContext } from "apps/wake/mod.ts";
import { GetProduct } from "../utils/graphql/queries.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import {
  GetProductQuery,
  GetProductQueryVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { toProduct } from "../utils/transform.ts";

export interface Props {
  id: number;
  partnerToken?: string;
}

/**
 * @title Wake Integration
 * @description Product Details Page loader
 */
async function loader(
  props: Props,
  req: Request,
  _ctx: AppContext,
): Promise<Product | null> {
  const url = new URL(req.url);
  const { id } = props;

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const headers = parseHeaders(req.headers);

  if (!id) return null;

  if (!id) {
    throw new Error("Missing product id");
  }

  try {
    const { product: wakeProduct } = await storefront.query<
      GetProductQuery,
      GetProductQueryVariables
    >(
      {
        variables: {
          productId: id,
          partnerAccessToken: props?.partnerToken ?? "",
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

    const product = toProduct(wakeProduct, { base: url });

    return product;
  } catch (error) {
    console.log(`Error in loader function: ${error.name} - ${error.message}`);
    return null;
  }
}

export default loader;
