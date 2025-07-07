import type { ListingFromAtoZ } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import NotFound from "../../sections/Product/NotFound.tsx";
import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
import Pagination from "../../components/search/Pagination.tsx";

export interface Link {
  label?: string;
  href?: string;
}
/** @title Listagem de A a Z */
export interface ListAtoZ {
  list?: Link[];
}

export interface Props {
  medicines: ListingFromAtoZ;
}

function ListingFromAtoZ({ medicines }: Props) {
  if (medicines?.items?.length < 1) {
    return <NotFound />;
  }

  const { pageInfo } = medicines;

  const currentPage = pageInfo?.currentPage ? pageInfo?.currentPage - 1 : 1;

  const breadcrumbs = [
    { label: "home", href: "/" },
    { label: "Medicamentos Referências", href: "/medicamentos-referencia" },
    {
      label: medicines.paramsVowel,
      href: `/medicamentos-referencia/${medicines.paramsVowel}`,
    },
  ];

  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <BreadcrumbOptimized breadcrumbs={breadcrumbs} pageInfo={pageInfo} />
      <div>
        <div>
          <div>
            <h1 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
              Medicamentos Referências com a letra:{" "}
              <span class="uppercase">{medicines.paramsVowel}</span>
              {pageInfo.currentPage > 1 && (
                <span>- Página {pageInfo.currentPage}</span>
              )}
            </h1>

            <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
              {medicines?.items
                ?.slice(currentPage * 40, pageInfo.currentPage * 40)
                .map((medicine) => (
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
          </div>
        </div>
      </div>

      {medicines?.items?.length && (
        <Pagination
          pageInfo={pageInfo}
          pathPrevius={`/medicamentos-referencia/${medicines.paramsVowel}`}
        />
      )}
    </section>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  if (props.medicines?.items?.length < 1) {
    ctx.response.status = 404;
  }

  return props;
};
export function LoadingFallback() {
  return (
    <div style={{ height: "100vh" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}

export default ListingFromAtoZ;
