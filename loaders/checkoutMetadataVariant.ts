import { AppContext } from "../apps/site.ts";
import { AppContext as WakeAppContext } from "apps/wake/mod.ts";
import { createGraphqlClient, gql } from "apps/utils/graphql.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import { AddToCartParams } from "apps/commerce/types.ts";
import { getCookies } from "std/http/cookie.ts";

export interface Props {
  AddToCartParams: AddToCartParams;
}

async function ProductAddMetaDataVariant(
  props: Props,
  req: Request,
  _ctx: AppContext & WakeAppContext,
): Promise<void> {
  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";
  const TOKENCART = "carrinho-id";
  const cookies = getCookies(req.headers);
  const cookiesCart = cookies[TOKENCART];

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const referer = req.headers;
  let slug;
  const refererUrl = referer.get("Referer");
  if (!(refererUrl?.split("/")[4] == "p")) {
    slug = refererUrl?.split("/")[3] + "/" + refererUrl?.split("/")[4];
  } else {
    slug = refererUrl?.split("/")[3];
  }

  const ProductMetaDataVariant = {
    query: gql`
      mutation addProductVariantMetadata(
      $productVariantId: Long!
    ){
      checkoutAddMetadataForProductVariant(
        checkoutId : "${cookiesCart}"
        productVariantId: $productVariantId
        metadata: [{key: "slug", value: "${slug}"}]
      ) {
        updateDate
      }
    }
  `,
  };

  const headers = parseHeaders(req.headers);

  await storefront.query({
    variables: {
      productVariantId: props.AddToCartParams.items[0].item_id,
    },
    ...ProductMetaDataVariant,
  }, { headers });
}

export default ProductAddMetaDataVariant;
