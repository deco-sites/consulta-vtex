// Constantes para a API
const API_BASE_URL = "https://auxiliarapi.consultaremedios.com.br";
const AUTH_TOKEN =
  "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360";

// Importar RequestURLParam do caminho correto
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";

/**
 * Obtém os dados de um produto pelo nome do produto
 * @param product - Nome do produto (ex: "cloridrato-de-metformina-teuto")
 * @returns Os dados do produto ou null em caso de erro
 */
export async function getProduct(product: RequestURLParam) {
  // Se não tiver o nome do produto, não podemos fazer a busca
  if (!product) {
    console.error("Nome do produto não fornecido para busca");
    return null;
  }

  try {
    // Remove o "/p" final do nome do produto se existir
    const cleanProduct = product.endsWith("/p")
      ? product.slice(0, -2)
      : product;
    const url = `${API_BASE_URL}/Product/_slug/${cleanProduct}`;

    // Fazendo a requisição para a API com fetch nativo
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (_error) {
    return null;
  }
}

// useEffect(() => {
//   const queryParams = new URLSearchParams(window.location.search);
//   offerParams.value = Number(queryParams.get("offer_id"));
//   if (offerParams.value == 0) {
//     offerParams.value = null;
//   }
//   const existingProductList = JSON.parse(
//     getCookie("ProductListCheckout") || "[]"
//   );
//   const productRefrigerated =
//     product.additionalProperty?.find(
//       (item) => item.name == "Temperatura de armazenamento"
//     )?.value == "Temperatura ambiente"
//       ? false
//       : true;
//   const sellersId = existingProductList?.map(
//     (element: any) => element.sellerId
//   );
//   const productsRefrigerated: number[] = [];
//   const productsRefrigeratedIds: number[] = [];
//   if (existingProductList.length > 0) {
//     existingProductList.forEach((productItem: any) => {
//       if (productItem.productRefrigerated) {
//         productsRefrigerated.push(productItem.sellerId);
//         productsRefrigeratedIds.push(productItem.productVariantId);
//       }
//     });
//   }

//   offerPriceParams.value =
//     productOffers.find((offer) => offer.productID == offerParams.value)
//       ?.price ?? null;

//   if (!cep.value) return;
//   (async () => {
//     const allShippingQuotes: ProductOfferShippingQuote[] = [];

//     try {
//       await Promise.all(
//         productOffers.map(async (offer) => {
//           let shippingQuotes;
//           if (offerParams.value) {
//             if (offer.productID == offerParams.value) {
//               shippingQuotes = await fetchShippingQuote(
//                 cep.value!,
//                 offer.productID!,
//                 1
//               );
//             }
//           } else {
//             shippingQuotes = await fetchShippingQuote(
//               cep.value!,
//               offer.productID!,
//               1
//             );
//           }
//           if (shippingQuotes?.shippingQuotes?.length) {
//             shippingQuotes.shippingQuotes.forEach((quote) => {
//               if (productRefrigerated) {
//                 if (
//                   !sellersId.includes(quote.distributionCenterId) ||
//                   productsRefrigeratedIds.includes(offer?.productID!)
//                 ) {
//                   allShippingQuotes.push({ ...quote, offer });
//                 }
//               } else if (
//                 !productsRefrigerated.includes(quote.distributionCenterId) ||
//                 productsRefrigeratedIds.includes(offer?.productID!)
//               ) {
//                 allShippingQuotes.push({ ...quote, offer });
//               }
//             });
//           }
//         })
//       );
//     } catch (error) {
//       console.error("Error fetching shipping quotes:", error);
//     } finally {
//       allShippingQuotesValue.value = allShippingQuotes;

//       if (allShippingQuotes.length > 0) {
//         const filteredQuotes = allShippingQuotes.filter(
//           (quote) => !quote.name.includes("|")
//         );

//         const retireQuotes = allShippingQuotes.filter((quote) =>
//           quote.name.includes("|")
//         );

//         if (filteredQuotes.length > 0) {
//           worseOfferQuotes.value = filteredQuotes.reduce((worse, current) =>
//             !worse || current.offer.price! > worse.offer.price!
//               ? current
//               : worse
//           );

//           bestOfferQuotes.value = filteredQuotes.reduce((best, current) =>
//             !best || current.offer.price! < best.offer.price! ? current : best
//           );

//           bestShippingQuotes.value = filteredQuotes.reduce((best, current) =>
//             !best || current.deadline < best.deadline ? current : best
//           );
//         } else {
//           worseOfferQuotes.value = null;
//           bestShippingQuotes.value = null;
//         }

//         if (retireQuotes.length > 0) {
//           bestShippingRetire.value = retireQuotes.reduce((best, current) =>
//             !best || current.value < best.value ? current : best
//           );
//         } else {
//           bestShippingRetire.value = null;
//         }
//       }

//       isLoading.value = false;
//     }
//   })();
// }, [cep.value]);
