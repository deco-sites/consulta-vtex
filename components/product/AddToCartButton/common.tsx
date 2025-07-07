import { AddToCartParams } from "../../../commerce/types.ts";
import { useState } from "preact/hooks";
import Button from "../../../components/ui/Button.tsx";
import { sendEvent } from "../../../sdk/analytics.tsx";
import { Product } from "../../../commerce/types.ts";
import { getCookie } from "../../../sdk/getCookie.ts";
import { setCookie } from "../../../sdk/setCookie.ts";
import { PropertyValue } from "deco-sites/consul-remedio/commerce/types.ts";
import { useUI } from "deco-sites/consul-remedio/sdk/useUI.ts";

export interface Props {
  /** @description: sku name */
  eventParams: AddToCartParams;
  onAddItem: () => Promise<void>;
  product: Product;
  productID: string | number;
  sellerId: number | undefined;
}

interface ProductCookieItem { // Renamed for clarity and consistency
  productId: string;
  slug: string | undefined;
  productVariantId: string | number;
  productRefrigerated: boolean;
  sellerId: number | undefined;
}

const useAddToCart = ({
  eventParams,
  onAddItem,
  product,
  productID,
  sellerId,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { displayCart } = useUI();
  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      await onAddItem();

      sendEvent({
        name: "add_to_cart",
        params: eventParams,
      });

      const productSlug = product.additionalProperty?.find(
        (item) => item.name == "Spot",
      )?.value;
      const productRefrigerated = product.additionalProperty?.find(
        (item) => item.name == "Temperatura de armazenamento",
      )?.value;
      const product_attr: PropertyValue[] = [];
      product.additionalProperty?.forEach((item) => {
        if (item.valueReference == "SPECIFICATION") product_attr.push(item);
      });

      const productItem: ProductCookieItem = {
        productId: product.productID,
        slug: productSlug,
        productVariantId: productID,
        productRefrigerated: productRefrigerated === "Temperatura ambiente"
          ? false
          : true,
        sellerId: sellerId ? sellerId : 0,
      };

      const existingProductList = JSON.parse(
        getCookie("ProductListCheckout") || "[]",
      );

      if (existingProductList.length > 0) {
        const productExists = existingProductList.some(
          (product) =>
            product.productVariantId === productItem.productVariantId,
        );
        if (!productExists) {
          existingProductList.push(productItem);
        }
      } else {
        existingProductList.push(productItem);
      }

      displayCart.value = true;

      // globalThis.location.href = "/checkout";

      setCookie("ProductListCheckout", JSON.stringify(existingProductList), 7);
    } finally {
      setLoading(false);
    }
  };

  return { onClick, loading, "data-deco": "add-to-cart" };
};

export default function AddToCartButton(props: Props) {
  const btnProps = useAddToCart(props);

  return (
    <Button
      {...btnProps}
      class="text-white bg-primary rounded font-light w-full hover:bg-accent duration-300 py-3 max-h-12"
    >
      Adicionar ao Carrinho
    </Button>
  );
}
