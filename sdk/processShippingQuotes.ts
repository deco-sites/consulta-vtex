import {
  OfferSellers,
  Product,
  ProductShippingQuote,
  ShippingQuote,
} from "../commerce/types.ts";

interface ProductOfferShippingQuote {
  deadline: number;
  deadlineInHours: number | null;
  distributionCenterId: number;
  id: string | null;
  name: string;
  shippingQuoteId: string;
  type: string;
  value: number;
  products: ProductShippingQuote[];
  offer: OfferSellers;
}

export async function processShippingQuotes({
  offerParams,
  offerPriceParams,
  product,
  productOffers,
  cep,
  allShippingQuotesValue,
  worseOfferQuotes,
  bestOfferQuotes,
  bestShippingQuotes,
  bestShippingRetire,
  isLoading,
  fetchShippingQuote,
  getCookie,
}: {
  offerParams: { value: number | null };
  offerPriceParams: { value: number | null };
  product: Product;
  productOffers: OfferSellers[];
  cep: { value: string | null };
  allShippingQuotesValue: { value: ProductOfferShippingQuote[] | null };
  worseOfferQuotes: { value: ProductOfferShippingQuote | null };
  bestOfferQuotes: { value: ProductOfferShippingQuote | null };
  bestShippingQuotes: { value: ProductOfferShippingQuote | null };
  bestShippingRetire: { value: ProductOfferShippingQuote | null };
  isLoading: { value: boolean };
  fetchShippingQuote: (
    cep: string,
    productId: number,
    quantity: number,
  ) => Promise<{ shippingQuotes?: ShippingQuote[] } | null>;
  getCookie: (name: string) => string | null;
}) {
  const queryParams = new URLSearchParams(window.location.search);
  offerParams.value = Number(queryParams.get("variant_id"));
  if (offerParams.value === 0) {
    offerParams.value = null;
  }

  const existingProductList: {
    sellerId: number;
    productRefrigerated: boolean;
    productVariantId: number;
  }[] = JSON.parse(getCookie("ProductListCheckout") || "[]");

  const productRefrigerated = product.additionalProperty?.find(
    (item) => item.name === "Temperatura de armazenamento",
  )?.value !== "Temperatura ambiente";

  const sellersId = existingProductList.map((item) => item.sellerId);
  const productsRefrigerated: number[] = [];
  const productsRefrigeratedIds: number[] = [];

  existingProductList.forEach((item) => {
    if (item.productRefrigerated) {
      productsRefrigerated.push(item.sellerId);
      productsRefrigeratedIds.push(item.productVariantId);
    }
  });

  offerPriceParams.value =
    productOffers.find((offer) => offer.productID === offerParams.value)
      ?.price ?? null;

  if (!cep.value) return;

  const allShippingQuotes: ProductOfferShippingQuote[] = [];
  console.log(productOffers, "hello");

  try {
    await Promise.all(
      productOffers.map(async (offer, index) => {
        let shippingQuotes;

        if (offerParams.value) {
          if (offer.productID === offerParams.value) {
            shippingQuotes = await fetchShippingQuote(
              cep.value!,
              offer.productID!,
              1,
            );
          }
        } else {
          shippingQuotes = await fetchShippingQuote(
            cep.value!,
            offer.productID!,
            1,
          );
        }

        if (shippingQuotes?.shippingQuotes?.length) {
          shippingQuotes.shippingQuotes.forEach((quote) => {
            if (productRefrigerated) {
              if (
                !sellersId.includes(quote.distributionCenterId) ||
                productsRefrigeratedIds.includes(offer.productID!)
              ) {
                allShippingQuotes.push({ ...quote, offer });
              }
            } else if (
              !productsRefrigerated.includes(quote.distributionCenterId) ||
              productsRefrigeratedIds.includes(offer.productID!)
            ) {
              allShippingQuotes.push({ ...quote, offer });
            }
          });
        }
      }),
    );
  } catch (error) {
    console.error("Error fetching shipping quotes:", error);
  } finally {
    allShippingQuotesValue.value = allShippingQuotes;
    console.log(allShippingQuotes);

    const filteredQuotes = allShippingQuotes.filter(
      (q) => !q.name.includes("|"),
    );
    const retireQuotes = allShippingQuotes.filter((q) => q.name.includes("|"));

    worseOfferQuotes.value = filteredQuotes.length
      ? filteredQuotes.reduce((worse, current) =>
        !worse || (current?.offer?.price ?? 0) > (worse?.offer?.price ?? 0)
          ? current
          : worse
      )
      : null;

    bestOfferQuotes.value = filteredQuotes.length
      ? filteredQuotes.reduce((best, current) =>
        !best || (current?.offer?.price ?? 0) < (best?.offer?.price ?? 0)
          ? current
          : best
      )
      : null;

    bestShippingQuotes.value = filteredQuotes.length
      ? filteredQuotes.reduce((best, current) =>
        !best || current.deadline < best.deadline ? current : best
      )
      : null;

    bestShippingRetire.value = retireQuotes.length
      ? retireQuotes.reduce((best, current) =>
        !best || current.value < best.value ? current : best
      )
      : null;

    isLoading.value = false;
  }
}
