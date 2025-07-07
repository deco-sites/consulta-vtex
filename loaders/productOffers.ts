import { AppContext } from "../apps/site.ts";
import { AppContext as WakeAppContext } from "apps/wake/mod.ts";
import { createGraphqlClient, gql } from "apps/utils/graphql.ts";
import { Exact } from "deco-sites/consul-remedio/utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { ShippingQuote } from "../commerce/types.ts";

export interface Props {
  cep: string;
  productId: number;
  quantity: number;
}

export const ShippingQuotes = {
  query: gql`
    query ShippingQuotes(
      $cep: CEP!
      $productVariantId: Long!
      $quantity: Int!
    ) {
      shippingQuotes(
        cep: $cep
        productVariantId: $productVariantId
        quantity: $quantity
      ) {
        deadline
        deadlineInHours
        distributionCenterId
        id
        name
        shippingQuoteId
        type
        value
        products {
          value
          distributionCenterId
          productVariantId
        }
      }
    }
  `,
};

export type ShippingQuotes = {
  shippingQuotes: ShippingQuote[];
};

export type ShippingQuoteQueryVariables = Exact<{
  cep: string;
  productVariantId: number;
  quantity: number;
}>;

async function productOffers(
  props: Props,
  req: Request,
  _ctx: AppContext & WakeAppContext,
): Promise<ShippingQuotes | null> {
  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const headers = parseHeaders(req.headers);
  const { cep, productId, quantity } = props;
  const data = await storefront.query<
    ShippingQuotes,
    ShippingQuoteQueryVariables
  >(
    {
      variables: {
        cep,
        productVariantId: productId,
        quantity,
      },
      ...ShippingQuotes,
    },
    {
      headers,
    },
  );

  return data;
}

export default productOffers;
