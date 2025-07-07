import { ListingFromAtoZresponse } from "../../loaders/ListingFromAtoZ.ts";

export interface Link {
  label?: string;
  href?: string;
}
/** @title Listagem de A a Z */
export interface ListAtoZ {
  title?: string;
  list?: Link[];
}

export interface Props {
  naveguete?: ListAtoZ;
  brands: ListingFromAtoZresponse;
}

function ListingFromAtoZ({ naveguete, brands }: Props) {
  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <div>
        <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-secondary-content max-lg:px-4">
          {naveguete?.title}
        </h2>
        <ul class="flex bg-white gap-2 py-6 max-lg:overflow-x-auto sticky top-0 border-b border-neutral max-lg:px-4">
          {naveguete?.list?.map((list) => (
            <li>
              <a
                class="btn text-nowrap  max-w-10 btn-primary text-white rounded uppercase shadow-none duration-300 hover:underline hover:scale-95 max-h-9 min-h-9 font-light"
                aria-label={`link ${list.label}`}
                href={list?.href}
                title={`Marcas com Letra: ${list?.label}`}
              >
                {list?.label}
              </a>
            </li>
          ))}
        </ul>

        <div>
          {naveguete?.list?.map((list) => {
            const filteredClasses = brands?.items?.filter((brand) => {
              const label = list?.label?.toLowerCase() || "";
              const brandName = brand.brandName?.toLowerCase() || "";

              if (label === "0-9") {
                // Cenário 1: label é "0-9", traz todos os nomes que começam com números
                return /^\d/.test(brandName);
              } else {
                // Cenário 2: verifica se começa com a mesma string do label
                return brandName.startsWith(label);
              }
            });
            return (
              <div>
                <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
                  Marcas com a letra:{" "}
                  <span class="uppercase">{list?.label}</span>
                </h2>

                <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
                  {filteredClasses?.slice(0, 20)?.map((brand) => (
                    <li class="border-b border-neutral py-4">
                      <a
                        title={brand?.customerTitle ?? brand?.brandName ?? ""}
                        href={`/marca/${brand.slug}`}
                        class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                      >
                        {brand.brandName}
                      </a>
                    </li>
                  ))}
                </ul>
                <div class="flex w-full justify-center pb-4 border-b border-neutral">
                  <a
                    title={`Tudo com a letra: ${list?.label?.toLocaleUpperCase()}`}
                    href={`/marcas/${list?.label}`}
                    class="btn text-center m-auto btn-primary text-white rounded uppercase shadow-none duration-300 hover:underline hover:scale-95 max-h-9 min-h-9 font-light"
                  >
                    Tudo com a letra: {list?.label}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LoadingFallback() {
  return (
    <div style={{ height: "100vh" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}

export default ListingFromAtoZ;
