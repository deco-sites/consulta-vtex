import { Suggestion } from "../commerce/types.ts";
import { AppContext } from "apps/wake/mod.ts";
import { Autocomplete } from "../utils/graphql/queries.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import {
  AutocompleteQuery,
  AutocompleteQueryVariables,
  ProductFragment,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { getPartnerCookie } from "apps/wake/utils/partner.ts";
import { toProduct } from "../utils/transform.ts";
import { fetchSafe } from "apps/utils/fetch.ts";

export interface Props {
  query: string;
  limit?: number;
}

/**
 * @title Wake Integration
 * @description Product Suggestion loader
 */
const loader = async (
  props: Props,
  req: Request,
  _ctx: AppContext,
): Promise<Suggestion | null> => {
  const { query, limit = 10 } = props;

  const partnerAccessToken = getPartnerCookie(req.headers);
  const headers = parseHeaders(req.headers);

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  if (!query) return null;

  const data = await storefront.query<
    AutocompleteQuery,
    AutocompleteQueryVariables
  >(
    {
      variables: {
        query,
        limit,
        partnerAccessToken,
      },
      ...Autocomplete,
    },
    {
      headers,
    },
  );

  const { products: wakeProducts, suggestions = [] } = data.autocomplete ?? {};

  if (!wakeProducts?.length && !suggestions?.length) return null;

  const products = wakeProducts
    ?.filter((node): node is ProductFragment => Boolean(node))
    .map((node) => toProduct(node, { base: req.url }));

  return {
    products: products,
    searches: suggestions?.filter(Boolean)?.map((suggestion) => ({
      term: suggestion!,
    })),
  };
};

export default loader;
