import { useSignal } from "@preact/signals";
import Button from "../../../components/ui/Button.tsx";
import { sendEvent } from "../../../sdk/analytics.tsx";
import { invoke } from "../../../runtime.ts";
import { useEffect } from "preact/hooks";
import { useUI } from "../../../sdk/useUI.ts";

export interface Props {
  productID: string;
  productGroupID?: string;
  variant?: "icon" | "full";
  removeItem?: () => Promise<void>;
  addItem?: () => Promise<void>;
  loading: boolean;
  inWishlist: boolean;
  isUserLoggedIn: boolean;
}

function ButtonCommon({
  variant = "icon",
  productGroupID,
  productID,
  inWishlist,
  isUserLoggedIn,
}: Props) {
  const fetching = useSignal(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const invokedUser = await invoke.site.loaders.user();

        const { isLoged, personValue } = useUI();
        isLoged.value = Boolean(invokedUser);
        personValue.value = invokedUser;
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUser();
  }, [fetching.value]);

  return (
    <Button
      style={{ padding: 0 }}
      class={variant === "icon"
        ? "gap-2 p-0 px-0"
        : "btn-primary btn-outline gap-2"}
      loading={fetching.value}
      aria-label="Add to wishlist"
      onClick={async (e) => {
        e.preventDefault();

        if (!isUserLoggedIn) {
          globalThis.location.pathname = "/login/authenticate";

          return;
        }

        try {
          fetching.value = true;

          if (inWishlist) {
            await invoke.site.loaders.wishlistRemoveItem({
              productId: Number(productGroupID),
            });
          } else if (productID && productGroupID) {
            await invoke.site.loaders.wishlist({
              productId: Number(productGroupID),
            });

            sendEvent({
              name: "add_to_wishlist",
              params: {
                items: [
                  {
                    item_id: productID,
                    item_group_id: productGroupID,
                    quantity: 1,
                  },
                ],
              },
            });
          }
        } finally {
          fetching.value = false;
        }
      }}
    >
      <svg
        id="HeartBlack"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill={inWishlist ? "#009999" : "black"}
      >
        <path
          d="M9.00135 3.09261L8.19472 2.26348C6.30135 0.317232 2.8296 0.988858 1.57635 3.43573C0.987972 4.58661 0.855222 6.24823 1.9296 8.36886C2.9646 10.4107 5.11785 12.8565 9.00135 15.5205C12.8848 12.8565 15.037 10.4107 16.0731 8.36886C17.1475 6.24711 17.0158 4.58661 16.4263 3.43573C15.1731 0.988858 11.7013 0.316107 9.80797 2.26236L9.00135 3.09261ZM9.00135 16.8761C-8.24828 5.47761 3.69022 -3.41889 8.80335 1.28698C8.87085 1.34886 8.93722 1.41298 9.00135 1.47936C9.06482 1.41304 9.13087 1.34924 9.19935 1.28811C14.3113 -3.42114 26.251 5.47648 9.00135 16.8761Z"
          fill={inWishlist ? "#009999" : "black"}
        />
      </svg>
      {
        /* <Icon
        id="HeartBlack"
        size={20}
        strokeWidth={2}
        fill={inWishlist ? "black" : "none"}
      />
      {variant === "icon" ? null : inWishlist ? "Remover" : "Favoritar"} */
      }
    </Button>
  );
}

export default ButtonCommon;
