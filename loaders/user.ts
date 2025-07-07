import { Person } from "../commerce/types.ts";
import type { AppContext } from "apps/wake/mod.ts";
import authenticate from "../utils/authenticate.ts";
import { GetUser } from "../utils/graphql/queries.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import {
  GetUserQuery,
  GetUserQueryVariables,
  SingleProductFragment,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { useUI } from "../sdk/useUI.ts";
import { toProduct } from "../utils/transform.ts";

/**
 * @title Wake Integration
 * @description User loader
 */
const userLoader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<Person | null> => {
  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";
  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const { isLoged } = useUI();

  const headers = parseHeaders(req.headers);
  const customerAccessToken = authenticate(req, ctx);

  if (!customerAccessToken) return null;

  try {
    const data = await storefront.query<GetUserQuery, GetUserQueryVariables>(
      {
        variables: { customerAccessToken },
        ...GetUser,
      },
      { headers },
    );

    const customer = data.customer;

    if (!customer) return null;

    isLoged.value = true;

    const products = customer?.wishlist?.products;
    const url = new URL(req.url);

    return {
      "@id": customer.id!,
      email: customer.email!,
      givenName: customer.customerName!,
      gender: customer?.gender === "Masculino"
        ? "https://schema.org/Male"
        : "https://schema.org/Female",
      addresses: customer.addresses,
      wishlist: {
        products: products
          ?.filter((node): node is SingleProductFragment => Boolean(node))
          .map((node) => toProduct(node, { base: url })) ?? null,
      },
    };
  } catch {
    return null;
  }
};

export default userLoader;
