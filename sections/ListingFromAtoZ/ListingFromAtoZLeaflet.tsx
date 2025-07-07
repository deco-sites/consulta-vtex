import { ListingFromAtoZresponse } from "../../loaders/ListingFromAtoZ.ts";
import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
export interface Link {
  label?: string;
  href?: string;
}
/** @title Listagem de A a Z */
export interface ListAtoZ {
  title?: string;
  list?: Link[];
}

/** @titleBy letter */
export interface leafletCategory {
  letter: string;
  data: ListingFromAtoZresponse;
}

export interface Props {
  breadcrumb?: Link[];
  title?: string;
  description?: string;
  naveguete?: ListAtoZ;
  leaflet: leafletCategory[];
}

function ListingFromAtoZ({
  breadcrumb,
  title,
  description,
  naveguete,
  leaflet,
}: Props) {
  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <BreadcrumbOptimized breadcrumbs={breadcrumb} />
      <div class="my-8 max-lg:px-4">
        <h1 class="text-[2rem] font-medium tracking-[-.09375rem] leading-tight text-info mb-2">
          {title}
        </h1>
        <p class="tracking-[.009375rem] text-secondary-content">
          {description}
        </p>
      </div>

      <div>
        <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-secondary-content max-lg:px-4">
          {naveguete?.title}
        </h2>
        <ul class="flex bg-white gap-2 py-6 max-lg:overflow-x-auto sticky top-0 border-b border-neutral max-lg:px-4">
          {naveguete?.list?.map((list) => (
            <li>
              <a
                class="btn text-nowrap max-w-10 btn-primary text-white rounded uppercase shadow-none duration-300 hover:underline hover:scale-95 max-h-9 min-h-9 font-light"
                aria-label={`link ${list.label}`}
                href={list?.href}
                title={`Bula com a Letra: ${list.label?.toLocaleUpperCase()}`}
              >
                {list?.label}
              </a>
            </li>
          ))}
        </ul>

        <div>
          {leaflet.map((list) => {
            let displayItems = list.data.items || [];

            if (list.letter === "0-9") {
              displayItems = list.data.items?.filter((leaflet) => {
                return /^\d/.test(leaflet.title?.toLowerCase() || "");
              });
            }
            return (
              <div>
                <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
                  Bulas de medicamentos com a letra:{" "}
                  <span class="uppercase">{list.letter}</span>
                </h2>

                <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
                  {displayItems.slice(0, 20)?.map((leaflet) => (
                    <li class="border-b border-neutral py-4">
                      <a
                        title={leaflet?.customerTitle ?? leaflet?.title ?? ""}
                        href={`/${leaflet.slug}/bula`}
                        class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                      >
                        Bula do {leaflet.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <div class="flex w-full justify-center pb-4 border-b border-neutral">
                  <a
                    title={`Tudo com a letra: ${list?.letter?.toLocaleUpperCase()}`}
                    href={`/bulas/${list.letter}`}
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
