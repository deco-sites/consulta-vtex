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
  substances: ListingFromAtoZ;
}

function ListingFromAtoZ({ substances }: Props) {
  if (substances?.items.length < 1) {
    return <NotFound />;
  }

  const { pageInfo } = substances;

  const currentPage = pageInfo?.currentPage ? pageInfo?.currentPage - 1 : 1;

  const breadcrumbs = [
    { label: "home", href: "/" },
    { label: "Princípios Ativos", href: "/principios-ativos" },
    {
      label: substances.paramsVowel,
      href: `/principios-ativos/${substances.paramsVowel}`,
    },
  ];

  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <BreadcrumbOptimized breadcrumbs={breadcrumbs} pageInfo={pageInfo} />
      <div>
        <div>
          <div>
            <h1 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
              Princípios Ativos com a letra:{" "}
              <span class="uppercase">{substances.paramsVowel}</span>
              {pageInfo.currentPage > 1 && (
                <span>- Página {pageInfo.currentPage}</span>
              )}
            </h1>

            <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
              {substances?.items
                ?.slice(currentPage * 40, pageInfo.currentPage * 40)
                .map((substance) => (
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
                          substance.substanceName ??
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
          </div>
        </div>
      </div>

      {substances.items.length && (
        <Pagination
          pageInfo={pageInfo}
          pathPrevius={`/principios-ativos/${substances.paramsVowel}`}
        />
      )}
    </section>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  if (props.substances?.items.length < 1) {
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
