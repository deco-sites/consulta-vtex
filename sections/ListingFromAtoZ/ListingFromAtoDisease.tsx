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

export interface Props {
  breadcrumb?: Link[];
  title?: string;
  description?: string;
  naveguete?: ListAtoZ;
  disease: ListingFromAtoZresponse;
}

function ListingFromAtoZ({
  breadcrumb,
  title,
  description,
  naveguete,
  disease,
}: Props) {
  return (
    <section class="max-w-[1336px] lg:px-10 m-auto py-6 lg:py-8">
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
                class="btn  btn-primary text-white rounded uppercase shadow-none duration-300 hover:underline hover:scale-95 max-h-9 min-h-9 font-light"
                aria-label={`link ${list.label}`}
                href={list?.href}
                title={`Doenças com a Letra: ${list?.label?.toLocaleUpperCase()}`}
              >
                {list?.label}
              </a>
            </li>
          ))}
        </ul>

        <div>
          {naveguete?.list?.map((list) => {
            const filteredClasses = disease?.items?.filter((disease) =>
              disease.diseaseName
                ?.toLowerCase()
                .startsWith(list?.label?.toLowerCase() || "")
            );

            return (
              <div>
                <h2 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
                  Doenças com a letra:{" "}
                  <span class="uppercase">{list?.label}</span>
                </h2>

                <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
                  {filteredClasses?.slice(0, 20)?.map((disease) => (
                    <li class="border-b border-neutral py-4">
                      <a
                        title={`Produtos para ${
                          disease?.customerTitle ?? disease.diseaseName ?? ""
                        }`}
                        href={`/doenca/${disease.slug}`}
                        class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                      >
                        Produtos para {disease.diseaseName}
                      </a>
                    </li>
                  ))}
                </ul>
                <div class="flex w-full justify-center pb-4 border-b border-neutral">
                  <a
                    href={`/doencas/${list?.label}`}
                    title={`Tudo com a letra: ${list?.label?.toLocaleUpperCase()}`}
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
