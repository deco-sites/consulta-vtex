import {
  OfferSellers,
  Product,
  ProductShippingQuote,
} from "../commerce/types.ts";
import { getCookie } from "./getCookie.ts";
import { shippingQuote } from "./shippingQuotes.ts";
import { useCart } from "apps/wake/hooks/useCart.ts";
interface Props {
  productOffers: OfferSellers[] | [];
  cep: string;
  product: Product;
}

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
  totalValue: number;
}

async function shippingQuotes({
  productOffers,
  cep,
  product,
}: Props): Promise<ProductOfferShippingQuote[] | null> {
  const allShippingQuotes: ProductOfferShippingQuote[] = [];

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
  if (existingProductList.length > 0) {
    existingProductList.forEach((productItem) => {
      if (productItem.productRefrigerated) {
        productsRefrigerated.push(productItem.sellerId);
        productsRefrigeratedIds.push(productItem.productVariantId);
      }
    });
  }

  try {
    if (productOffers.length > 0) {
      await Promise.all(
        productOffers.map(async (offer) => {
          const shippingQuotesData = await shippingQuote(
            cep,
            offer.productID!,
            1,
          );

          if (shippingQuotesData?.shippingQuotes?.length) {
            shippingQuotesData?.shippingQuotes.forEach((quote) => {
              if (productRefrigerated) {
                if (
                  !sellersId.includes(quote.distributionCenterId) ||
                  productsRefrigeratedIds.includes(offer.productID!)
                ) {
                  allShippingQuotes.push({
                    ...quote,
                    offer,
                    totalValue: quote.value + (offer?.price ?? 0),
                  });
                }
              } else if (
                !productsRefrigerated.includes(quote.distributionCenterId) ||
                productsRefrigeratedIds.includes(offer.productID!)
              ) {
                allShippingQuotes.push({
                  ...quote,
                  offer,
                  totalValue: quote.value + (offer?.price ?? 0),
                });
              }
            });
          }
        }),
      );
      return allShippingQuotes;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default shippingQuotes;
