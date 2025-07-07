import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { headerHeight } from "./constants.ts";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

export interface Props {
  item: SiteNavigationElement;
}

function calcularColuna(leaf: SiteNavigationElement): number {
  const subLeaf = leaf.children?.length || 0;
  const subSubLeaf = leaf.children
    ? leaf.children
      ?.map((subLeaf) => subLeaf.children?.length || 0)
      .reduce((a, b) => a + b, 0)
    : 0;

  const totalItens = subLeaf + subSubLeaf;

  if (totalItens <= 10) return 1;
  if (totalItens <= 20) return 2;
  if (totalItens <= 30) return 3;
  return 4;
}

function NavItem({ item }: Props) {
  const { name, children } = item;
  const image = item.image?.[0];

  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.removeAttribute("open");
      }
    }

    console.log("Adding mousedown event listener");

    globalThis.document.addEventListener("mousedown", handleClickOutside);
    return () => {
      globalThis.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li class="flex items-start">
      <details ref={detailsRef} id="category-menu">
        <summary class="list-none marker:list-none">
          <div>
            <span class="text-white font-light cursor-pointer">{name}</span>
          </div>
        </summary>
        {
          <>
            {children && children.length > 0 && (
              <div
                class="absolute bg-base-100 z-50 items-start justify-start gap-6 w-auto max-h-[80vh] rounded-bl-lg shadow-lg"
                style={{ top: "-48px", left: "80px", marginTop: headerHeight }}
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
                      {node.url
                        ? (
                          <span class="ml-6 mb-4 text-[18px] font-medium">
                            {node.name}
                          </span>
                        )
                        : (
                          <p class="cursor-pointer">
                            <span class="ml-6 mb-4 text-[18px] font-medium">
                              {node.name}
                            </span>
                          </p>
                        )}

                      <ul class="flex flex-col gap-1 mt-4 max-h-[68vh] overflow-y-auto custom-scroll">
                        {node.children?.map((leaf) => (
                          <li class="group">
                            <div>
                              <span class="block w-full text-base font-normal py-2 pl-6 hover:bg-[#F6FBFF] cursor-pointer">
                                {leaf.name}
                              </span>
                            </div>

                            {leaf.children && leaf.children.length > 0 && (
                              <div class="submenu-lateral absolute top-0 z-50 h-full items-start py-6 pl-6 bg-[#F6FBFF] rounded-br-lg overflow-x-hidden scroll-children max-w-[80vw] hidden group-hover:flex left-[95%]">
                                <ul
                                  class="gap-4 overflow-y-auto w-auto overflow-x-hidden"
                                  style={{
                                    columns: `${calcularColuna(leaf)}`,
                                  }}
                                >
                                  {leaf.children.map((subLeaf) => (
                                    <li class="mb-6 mr-4 w-[200px]">
                                      <a
                                        class="hover:underline"
                                        href={subLeaf.url}
                                      >
                                        <span class="text-base font-bold">
                                          {subLeaf.name}
                                        </span>
                                      </a>

                                      {subLeaf.children &&
                                        subLeaf.children.length > 0 && (
                                        <ul class="mt-6">
                                          {subLeaf.children.map(
                                            (subSubLeaf) => (
                                              <li class="mt-6">
                                                <a
                                                  class="hover:underline"
                                                  href={subSubLeaf.url}
                                                >
                                                  {subSubLeaf.name}
                                                </a>
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )}
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
        }
      </details>
    </li>
  );
}

export default NavItem;
