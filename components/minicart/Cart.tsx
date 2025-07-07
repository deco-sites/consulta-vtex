// import { platform } from "../../apps/storefront.ts";
import { lazy } from "preact/compat";
import { usePlatform } from "../../sdk/usePlatform.tsx";

const CartWake = lazy(() => import("./wake/Cart.tsx"));

export interface Props {
  platform: ReturnType<typeof usePlatform>;
}

function Cart({ platform }: Props) {
  if (platform === "wake") {
    return <CartWake />;
  }

  return null;
}

export default Cart;
