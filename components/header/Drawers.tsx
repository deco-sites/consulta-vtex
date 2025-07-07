import type { Props as MenuProps } from "../../components/header/Menu.tsx";
import Cart from "../../components/minicart/Cart.tsx";
import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import Button from "../../components/ui/Button.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { ComponentChildren } from "preact";
import { lazy, Suspense } from "preact/compat";
import { effect, useSignal } from "@preact/signals";

const Menu = lazy(() => import("../../components/header/Menu.tsx"));
const Searchbar = lazy(() => import("../../components/search/Searchbar.tsx"));

export interface Props {
  menu: MenuProps;
  searchbar?: SearchbarProps;
  /**
   * @ignore_gen true
   */
  children?: ComponentChildren;
  platform: ReturnType<typeof usePlatform>;
}

const Aside = ({
  title,
  onClose,
  children,
  isMenu = false,
}: {
  title: string;
  onClose?: () => void;
  children: ComponentChildren;
  isMenu?: boolean;
}) => {
  const navigationLevel = useSignal(0);
  const currentCategory = useSignal("");

  if (isMenu) {
    effect(() => {
      const checkMenuState = () => {
        const backButton = document.querySelector(
          'button[class*="p-4 text-left"]',
        );

        if (backButton) {
          navigationLevel.value = 1;

          const firstMenuItem = document.querySelector(
            'ul[class*="px-4 flex-grow"] li:first-child',
          );
          if (firstMenuItem) {
            const buttonOrLink = firstMenuItem.querySelector("button, a");
            if (buttonOrLink) {
              currentCategory.value = buttonOrLink.textContent?.trim() || "";
            }
          }
        } else {
          navigationLevel.value = 0;
          currentCategory.value = "";
        }
      };

      const observer = new MutationObserver(checkMenuState);
      observer.observe(document.body, { childList: true, subtree: true });

      const timeoutId = setTimeout(checkMenuState, 100);

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    });
  }

  return (
    <div
      class={`bg-base-100 grid grid-rows-[auto_1fr] ${
        title == "Buscar" ? "h-fit" : "h-full"
      } divide-y w-[100vw] ${
        title != "Buscar" ? "max-w-[350px]" : "lg:max-w-md"
      } `}
    >
      <div>
        {isMenu
          ? (
            navigationLevel.value === 0
              ? (
                <div class="flex justify-around items-center mt-8 mb-9 mx-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                  >
                    <g id="Logo-lockup-CR">
                      <g id="Vector">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13.5117 19.234C13.5008 19.234 13.4904 19.2346 13.4794 19.2346C11.1437 19.2346 9.25061 17.3323 9.25061 14.9859C9.25061 12.6395 11.1437 10.7373 13.4794 10.7373C13.4904 10.7373 13.5008 10.7378 13.5117 10.7378V4.37555C13.5008 4.37555 13.4904 4.375 13.4794 4.375C7.64608 4.375 2.91666 9.12543 2.91666 14.9859C2.91666 20.8464 7.64608 25.5968 13.4794 25.5968C13.4904 25.5968 13.5008 25.5968 13.5117 25.5968V19.234Z"
                          fill="#009999"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M22.0732 4.37884L15.6005 4.375L15.6141 10.7795C15.6141 10.7795 21.2316 10.7713 21.4677 10.7707C23.798 10.7658 25.6911 12.6379 25.696 14.9788C25.7009 17.2873 23.8679 19.1676 21.5825 19.2241L16.7957 19.2346L23.78 29.3849L31.1484 29.3684L27.3366 23.8713C30.203 21.9625 32.0895 18.6899 32.0819 14.9771C32.0699 9.30549 27.6415 4.68079 22.0732 4.37884Z"
                          fill="#66CCCC"
                        />
                      </g>
                    </g>
                  </svg>
                  <a
                    href="/login/authenticate"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-1 px-3 rounded text-sm uppercase transition-colors duration-300 shadow"
                  >
                    ENTRAR OU CRIAR CONTA
                  </a>
                  {onClose && (
                    <Button
                      aria-label="X"
                      class="btn btn-ghost"
                      onClick={onClose}
                    >
                      <Icon id="XMark" size={24} strokeWidth={2} />
                    </Button>
                  )}
                </div>
              )
              : <div></div>
          )
          : (
            <div
              class={`bg-base-100 grid grid-rows-[auto_1fr] divide-y ${
                title == "Buscar" ? "max-w-full" : "max-w-[350px]"
              } ${title == "Buscar" ? "h-fit" : "h-full "}`}
            >
              <div class="flex justify-between items-center">
                <p class="px-4 py-3">
                  <span class="font-medium text-xl">{title}</span>
                </p>
                {onClose && (
                  <Button
                    aria-label="X"
                    class=" px-4"
                    onClick={onClose}
                  >
                    <Icon id="CartButtonClose" size={16} strokeWidth={2} />
                  </Button>
                )}
              </div>
            </div>
          )}
      </div>
      <Suspense
        fallback={
          <div class="w-screen flex items-center justify-center">
            <span class="loading loading-ring" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
};

function Drawers({ menu, searchbar, children, platform }: Props) {
  const { displayCart, displayMenu, displaySearchDrawer } = useUI();

  return (
    <Drawer // left drawer
      open={displayMenu.value || displaySearchDrawer.value}
      onClose={() => {
        displayMenu.value = false;
        displaySearchDrawer.value = false;
      }}
      aside={
        <Aside
          onClose={() => {
            displayMenu.value = false;
            displaySearchDrawer.value = false;
          }}
          title={displayMenu.value ? "Menu" : "Buscar"}
          isMenu={displayMenu.value}
        >
          {displayMenu.value && (
            <Menu
              {...menu}
              onClose={() => {
                displayMenu.value = false;
                displaySearchDrawer.value = false;
              }}
            />
          )}
          {displaySearchDrawer.value && searchbar && (
            <Searchbar {...searchbar} />
          )}
        </Aside>
      }
    >
      <Drawer // right drawer
        class="drawer-end"
        open={displayCart.value !== false}
        onClose={() => (displayCart.value = false)}
        aside={
          <Aside title="Carrinho" onClose={() => (displayCart.value = false)}>
            <Cart platform={platform} />
          </Aside>
        }
      >
        {children}
      </Drawer>
    </Drawer>
  );
}

export default Drawers;
