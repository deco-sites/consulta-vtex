import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { useSignal } from "@preact/signals";
import Button from "../../components/ui/Button.tsx";
import type { NavItemsMobile, NavItemsSecondary } from "./Header.tsx";

export interface Props {
  items: SiteNavigationElement[];
  onClose?: () => void;
  itemsMob?: NavItemsMobile[];
  itemsDesk?: NavItemsSecondary[];
}

function Menu({ items, onClose, itemsMob }: Props) {
  const navigation = useSignal<SiteNavigationElement[][]>([items]);
  const currentItems = navigation.value[navigation.value.length - 1];

  function navigateTo(children: SiteNavigationElement[]) {
    if (
      children.length === 1 && children[0].children &&
      children[0].children.length > 0
    ) {
      navigation.value = [...navigation.value, children[0].children];
    } else {
      navigation.value = [...navigation.value, children];
    }
  }

  function navigateBack() {
    if (navigation.value.length > 1) {
      navigation.value = navigation.value.slice(0, navigation.value.length - 1);
    }
  }
  return (
    <div class="flex flex-col h-full !border-0">
      {navigation.value.length > 1 && (
        <div class="flex items-center justify-between mt-2">
          <button
            onClick={navigateBack}
            class="p-4 text-left flex items-center gap-6 text-lg font-semibold"
          >
            <Icon id="ArrowLeft" size={24} strokeWidth={2} />
            {navigation.value.length > 2 ? "Voltar" : "Voltar para o menu"}
          </button>
          {onClose && (
            <Button aria-label="X" class="btn btn-ghost" onClick={onClose}>
              <Icon id="XMark" size={24} strokeWidth={2} />
            </Button>
          )}
        </div>
      )}

      <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200 overflow-y-auto max-h-[85vh]">
        {navigation.value.length === 1 && itemsMob && itemsMob.length > 0 && (
          <>
            {itemsMob.map((item) => (
              <li
                class={`py-4 px-4 ${
                  item.label === "Fale com a gente" ? "border-t" : "!border-0"
                }`}
              >
                <div class="flex justify-between">
                  <a
                    href={item.href}
                    target={item.target}
                    class="flex items-center gap-3 text-base hover:underline"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.label}
                        width={20}
                        height={20}
                      />
                    )}
                    {item.label}
                  </a>
                </div>
              </li>
            ))}
          </>
        )}

        {currentItems.map((item, index) => (
          <li class="py-4 px-4">
            {item.children && item.children.length > 1 ||
                item.name === "Categorias"
              ? (
                <div class="flex justify-between">
                  <div class="flex items-center gap-3 flex-grow">
                    {item.name === "Categorias" && (
                      <Icon id="Message" size={28} strokeWidth={2} />
                    )}
                    <button
                      class="block w-full text-left"
                      onClick={() => item.children && navigateTo(item.children)}
                    >
                      {item.name}
                    </button>
                  </div>
                  <Icon id="arrowRight" size={24} strokeWidth={2} />
                </div>
              )
              : (
                <a
                  href={item.url}
                  class={`block hover:underline ${
                    index === 0 ? "text-[19px] font-medium" : ""
                  }`}
                >
                  {item.name}
                </a>
              )}
          </li>
        ))}

        {navigation.value.length === 1 && (
          <>
            <li class="py-4 px-4 border-t">
              <a
                target="_blank"
                href="https://survey.consultaremedios.com.br/zs/yKClyK?origin=%2F"
                class="flex items-center gap-3"
              >
                <Icon id="Message" size={20} strokeWidth={2} />
                <h3 class="text-base ">Fazer uma avaliação</h3>
              </a>
            </li>
            <li class="py-4 px-4 border-t !border-b">
              <a href="/login/authenticate" class="flex items-center gap-3">
                <Icon id="login" size={24} strokeWidth={2} />
                <h3 class="text-base ">Login</h3>
              </a>
            </li>
          </>
        )}

        {
          /* {navigation.value.length === 1 && itemsDesk && itemsDesk.length > 0 && (
          <>
            {itemsDesk.map((item) => (
              <li class="py-4 px-4 !border-0">
                <div class="flex justify-between">
                  <a
                    href={item.href}
                    target={item.target}
                    class="text-base hover:underline"
                  >
                    {item.label}
                  </a>
                </div>
              </li>
            ))}
          </>
        )} */
        }
      </ul>
    </div>
  );
}

export default Menu;
