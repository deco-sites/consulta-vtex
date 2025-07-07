import { invoke } from "../runtime.ts";
import { ProductOfferShippingQuote } from "../components/product/ProductBuyBox/ProductBuyBox.tsx";

interface GetOffers {
  offers?: ProductOfferShippingQuote[];
}

export async function shippingQuote(
  cep: string,
  productId: number,
  quantity: number,
) {
  try {
    const response = await invoke.site.loaders.productOffers({
      cep,
      productId,
      quantity,
    });

    return response;
  } catch (error) {
    console.log("Error fetching product:", error);
  }
}

export function getBestOffer({ offers }: GetOffers) {
  return offers?.length
    ? offers.reduce((best, current) =>
      !best || (current?.totalValue ?? 0) < (best?.totalValue ?? 0)
        ? current
        : best
    )
    : null;
}
export function getFastOffer({ offers }: GetOffers) {
  return offers?.length
    ? offers.reduce((best, current) =>
      !best || current.deadline < best.deadline ? current : best
    )
    : null;
}
export function getWorseOffer({ offers }: GetOffers) {
  return offers?.length
    ? offers.reduce((worse, current) =>
      !worse || (current?.offer?.price ?? 0) > (worse?.offer?.price ?? 0)
        ? current
        : worse
    )
    : null;
}

// let data = await storefront.query<SearchQuery, SearchQueryVariables>(
//   {
//     variables: {
//       query: `${
//         product && product.length > 8
//           ? product.replace(/-/g, " ").replace(/\s*\d+$/, "")
//           : product
//       }${!validateSlug ? "/p" : ""} ${
//         validateSlug && slug && slug.length > 8
//           ? slug.replace(/-/g, " ")
//           : !validateSlug
//           ? slug
//           : ""
//       }`,
//       operation: "AND",
//       limit: 50,
//       ignoreDisplayRules: true,
//       maximumPrice: 0.1,
//     },
//     ...Search,
//   },
//   {
//     headers,
//   }
// );

// const half = Math.floor(product?.length / 2);

// const sliceQuery = product?.slice(0, half)?.replace(/-/g, " ");

// if (data?.result?.productsByOffset?.items?.length === 0) {
//   data = await storefront.query<SearchQuery, SearchQueryVariables>(
//     {
//       variables: {
//         query:
//           product.length > 14
//             ? sliceQuery
//             : `${product?.replace(/-/g, " ")}/p`,
//         operation: "AND",
//         limit: 50,
//         ignoreDisplayRules: true,
//         maximumPrice: 0.1,
//       },
//       ...Search,
//     },
//     {
//       headers,
//     }
//   );
// }

// const urlPath = `/${product}${slug ? `/${slug}/p` : ""}`;

// const productResult = data.result.productsByOffset.items.find(
//   (item) =>
//     item.spotInformation?.replace("https://consultaremedios.com.br", "") ===
//     urlPath
// );

// const productResultValidate = data.result.productsByOffset.items.find(
//   (item) =>
//     item.spotInformation
//       ?.replace("https://consultaremedios.com.br", "")
//       ?.includes(product)
// );

// const productId = Number(
//   productResult?.productId ?? productResultValidate?.productId
// );

// const variantId = Number(
//   productResult?.productVariantId ?? productResultValidate?.productVariantId
// );

// console.log(productId);
