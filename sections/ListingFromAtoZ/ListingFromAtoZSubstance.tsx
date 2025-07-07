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
  substances: ListingFromAtoZresponse;
}

function ListingFromAtoZ({ naveguete, substances }: Props) {
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
                title={`Princípios Ativos com a Letra: ${list?.label?.toLocaleUpperCase()}`}
                class="btn text-nowrap max-w-10 btn-primary text-white rounded uppercase shadow-none duration-300 hover:underline hover:scale-95 max-h-9 min-h-9 font-light"
                aria-label={`link ${list.label}`}
                href={list?.href}
              >
                {list?.label}
              </a>
            </li>
          ))}
        </ul>

        <div>
          {naveguete?.list?.map((list) => {
            const filteredClasses = substances?.items?.filter((substance) => {
              const label = list?.label?.toLowerCase() || "";
              const substanceName = substance.substanceName?.toLowerCase() ||
                "";

              if (label === "0-9") {
                // Cenário 1: label é "0-9", traz todos os nomes que começam com números
                return /^\d/.test(substanceName);
              } else {
                // Cenário 2: verifica se começa com a mesma string do label
                return substanceName.startsWith(label);
              }
            });
            return (
              <div>
                <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
                  Princípios Ativos com a letra:{" "}
                  <span class="uppercase">{list?.label}</span>
                </h2>

                <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
                  {filteredClasses?.slice(0, 20)?.map((substance) => (
                    <li class="border-b border-neutral py-4">
                      <a
                        title={substance?.customerTitle ??
                          substance.substanceName ??
                          ""}
                        href={`/${substance.slug}/pa`}
                        class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                      >
                        {substance.substanceName}
                      </a>
                      <a
                        title={`Bula do ${
                          substance?.customerTitle ??
                            substance?.substanceName ??
                            ""
                        }`}
                        href={`/${substance.slug}/bula`}
                        class="mt-2 block leading-normal tracking-[.009375rem] text-primary underline hover:underline  max-lg:px-4"
                      >
                        Bula do {substance.substanceName}
                      </a>
                    </li>
                  ))}
                </ul>
                <div class="flex w-full justify-center pb-4 border-b border-neutral">
                  <a
                    title={`Tudo com a letra: ${list?.label?.toLocaleUpperCase()}`}
                    href={`/principios-ativos/${list?.label}`}
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
