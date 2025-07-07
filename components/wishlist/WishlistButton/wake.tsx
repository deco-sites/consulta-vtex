// import { useComputed } from "@preact/signals";
import Button from "./common.tsx";
import { useUI } from "../../../sdk/useUI.ts";

export interface Props {
  productID: string;
  productGroupID?: string;
  variant?: "icon" | "full";
}

function WishlistButton({
  variant = "icon",
  productGroupID,
  productID,
}: Props) {
  const { isLoged, personValue } = useUI();

  const listItem = personValue?.value?.wishlist?.products?.find(
    (product) =>
      Number(product?.inProductGroupWithID) == Number(productGroupID),
  );

  const inWishlist = Boolean(listItem);

  return (
    <Button
      loading={inWishlist}
      inWishlist={inWishlist}
      isUserLoggedIn={isLoged.value}
      variant={variant}
      productGroupID={productGroupID}
      productID={productID}
    />
  );
}

export default WishlistButton;
