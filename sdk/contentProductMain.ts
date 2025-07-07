import { Product } from "../commerce/ContentTypes.ts";
import { getSubstance } from "../sdk/getSubstance.ts";
import mergeAndSortAttributes from "deco-sites/consul-remedio/sdk/mergeAttributesProduct.ts";
// Constants
const AUTH_TOKEN =
  "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360";
const API_BASE_URL = "https://auxiliarapi.consultaremedios.com.br";

export interface Props {
  product: string;
}

export async function contentProductMain(
  props: Props,
): Promise<Product | null> {
  const { product } = props;

  console.log("url bula", product);
  if (!product) {
    console.error("Product slug not provided");
    return null;
  }

  try {
    // URL to fetch the complete product
    const url = `${API_BASE_URL}/product/_slug/${product}`;

    // Making the API request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    // Get the product data
    const productData = (await response.json()) as Product;

    // Fetch substance data if needed
    if (productData?.substanceId) {
      try {
        const substanceUrl =
          `${API_BASE_URL}/substance/${productData.substanceId}`;

        const substanceResponse = await fetch(substanceUrl, {
          method: "GET",
          headers: {
            Authorization: AUTH_TOKEN,
            "Content-Type": "application/json",
          },
        });
        if (substanceResponse.ok) {
          const substanceData = await substanceResponse.json();

          const attrsItens = mergeAndSortAttributes(
            productData?.productAttribute,
            substanceData?.substanceAttribute,
          );

          // Combine substance data with the original product data
          productData.substance = {
            ...productData.substance,
            ...substanceData,
            disease: substanceData.disease || [],
          };

          productData.productAttribute = attrsItens;
        }
      } catch (substanceError) {
        console.warn("Error fetching substance data:", substanceError);
      }
    }

    if (!productData?.substanceId) {
      const substance = await getSubstance(product);
      if (substance && !productData?.substanceId) {
        return {
          ...productData,
          substance: {
            ...substance,
            disease: substance.disease || [],
          },
        };
      } else {
        return productData;
      }
    } else {
      return productData;
    }

    // console.log("productData", productData);
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}
