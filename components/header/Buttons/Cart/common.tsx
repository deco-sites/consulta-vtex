import { AnalyticsItem } from "apps/commerce/types.ts";
import Icon from "../../../../components/ui/Icon.tsx";
// import { sendEvent } from "../../../../sdk/analytics.tsx";
import { useUI } from "../../../../sdk/useUI.ts";

interface Props {
  loading: boolean;
  currency: string;
  total: number;
  items: AnalyticsItem[];
}

function CartButton({ items }: Props) {
  const { displayCart } = useUI();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div
      class="indicator"
      onClick={() => {
        displayCart.value = true;
      }}
    >
      <span
        class={`indicator-item badge badge-warning badge-sm font-bold text-info ${
          totalItems === 0 ? "hidden" : ""
        }`}
      >
        {totalItems > 9 ? "9+" : totalItems}
      </span>

      <div
        class="hover:bg-accent bg-transparent px-2 py-1 rounded border-none min-h-4 h-auto text-white cursor-pointer"
        aria-label="open cart"
        data-deco={displayCart.value && "open-cart"}
      >
        <Icon id="ShoppingCart" size={20} strokeWidth={2} />
      </div>
    </div>
  );
}

export default CartButton;
