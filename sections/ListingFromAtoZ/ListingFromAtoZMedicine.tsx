import { ListingFromAtoZresponse } from "../../loaders/ListingFromAtoZ.ts";
export interface Link {
  label?: string;
  href?: string;
}
/** @title Listagem de A a Z */
export interface ListAtoZ {
  title?: string;
  subtitle?: string;
  list?: Link[];
}
/** @titleBy letter */
export interface medicineCategory {
  letter: string;
  data: ListingFromAtoZresponse;
}

export interface Props {
  naveguete?: ListAtoZ;
  medicine: medicineCategory[];
}

function ListingFromAtoZ({ naveguete, medicine }: Props) {
  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <div>
        <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-secondary-content max-lg:px-4">
          {naveguete?.title}
        </h2>
        <p class="text-base text-gray-600 font-normal">{naveguete?.subtitle}</p>
        <ul class="flex bg-white gap-2 py-6 max-lg:overflow-x-auto sticky top-0 border-b border-neutral max-lg:px-4">
          {naveguete?.list?.map((list) => (
            <li>
              <a
                title={`Medicamentos com a Letra: ${list?.label?.toLocaleUpperCase()}`}
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
          {medicine.map((list) => {
            let displayItems = list.data.items || [];

            if (list.letter === "0-9") {
              displayItems = list.data.items?.filter((medicine) => {
                return /^\d/.test(medicine.title?.toLowerCase() || "");
              });
            }

            return (
              <div>
                <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
                  Medicamentos com a letra:{" "}
                  <span class="uppercase">{list.letter}</span>
                </h2>

                <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
                  {displayItems.slice(0, 20)?.map((medicine) => (
                    <li class="border-b border-neutral py-4">
                      <a
                        title={medicine?.title ?? ""}
                        href={`/${medicine.slug}/p`}
                        class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                      >
                        {medicine.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <div class="flex w-full justify-center pb-4 border-b border-neutral">
                  <a
                    title={`Tudo com a letra: ${list.letter?.toLocaleUpperCase()}`}
                    href={`/medicamentos/${list.letter}`}
                    class="btn text-center m-auto btn-primary text-white rounded uppercase shadow-none duration-300 hover:underline hover:scale-95 max-h-9 min-h-9 font-light"
                  >
                    Tudo com a letra: {list.letter}
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
