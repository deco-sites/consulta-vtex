import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { headerHeight } from "./constants.ts";
import { useSignal } from "@preact/signals";
export interface Props {
  item: SiteNavigationElement;
}

function NavItemMobile({ item }: Props) {
  const { children } = item;
  const image = item.image?.[0];
  const showMenu = useSignal(false);
  const openLeaf = useSignal<string | undefined>(undefined);

  function toggleNavItem() {
    showMenu.value = !showMenu.value;
  }

  return (
    <li class="group flex items-start">
      <div onClick={toggleNavItem}>
        <span class="text-white font-light"></span>
      </div>

      {showMenu.value && (
        <>
          {children && children.length > 0 && (
            <div
              class="absolute bg-base-100 z-50 items-start justify-start gap-6 w-auto max-h-[80vh] rounded-bl-lg"
              style={{ top: "0", left: "80px", marginTop: headerHeight }}
            >
              {image?.url && (
                <Image
                  class="p-6"
                  src={image.url}
                  alt={image.alternateName}
                  width={300}
                  height={332}
                  loading="eager"
                />
              )}
              <ul class="flex items-start justify-center gap-6 max-h-[80vh]">
                {children.map((node) => (
                  <li class="py-4">
                    <a href={node.url}>
                      <span class="ml-6 mb-4 text-[18px] font-medium">
                        {node.name}
                      </span>
                    </a>

                    <ul class="flex flex-col gap-1 mt-4 max-h-[68vh] overflow-y-auto custom-scroll">
                      {node.children?.map((leaf) => (
                        <li onMouseEnter={() => (openLeaf.value = leaf.name)}>
                          <div>
                            <span class="block w-full text-base font-normal py-2 pl-6 hover:bg-[#F6FBFF]">
                              {leaf.name}
                            </span>
                          </div>

                          {leaf.children &&
                            leaf.children.length > 0 &&
                            openLeaf.value === leaf.name && (
                            <div class="submenu-lateral absolute top-0 left-full z-50 min-w-[252px] h-full items-start py-6 pl-6 bg-[#F6FBFF] rounded-br-lg">
                              <ul class="flex flex-col gap-4 w-full overflow-y-auto max-h-[70vh] scroll-children">
                                {leaf.children.map((subLeaf) => (
                                  <li class="mb-3 mr-2">
                                    <a
                                      class="hover:underline"
                                      href={subLeaf.url}
                                    >
                                      <span class="text-base font-bold">
                                        {subLeaf.name}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default NavItemMobile;
