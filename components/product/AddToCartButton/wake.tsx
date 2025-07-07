import { useCart } from "apps/wake/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";
import { AnalyticsItem, Product } from "../../../commerce/types.ts";
import { ProductOfferShippingQuote } from "../ProductBuyBox/ProductBuyBox.tsx";

export interface Props
  extends Omit<BtnProps, "onAddItem" | "eventParams" | "sellerId"> {
  quantity: number;
  productID: string | number;
  product: Product;
  offer: ProductOfferShippingQuote | null | undefined;
  eventParams: { items: AnalyticsItem[] };
}

function AddToCartButton({
  product,
  productID,
  eventParams,
  quantity,
  offer,
}: Props) {
  const { addItem } = useCart();

  const sellerId = offer?.distributionCenterId;

  const onAddItem = () =>
    addItem({
      productVariantId: Number(productID),
      quantity,
    });

  return (
    <Button
      onAddItem={onAddItem}
      eventParams={eventParams}
      product={product}
      productID={productID}
      sellerId={sellerId}
    />
  );
}

export default AddToCartButton;
