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
  therapeuticClass: ListingFromAtoZ;
}

function ListingFromAtoZ({ therapeuticClass }: Props) {
  if (therapeuticClass?.items.length < 1) {
    return <NotFound />;
  }

  const { pageInfo } = therapeuticClass;

  const currentPage = pageInfo?.currentPage ? pageInfo?.currentPage - 1 : 1;

  const breadcrumbs = [
    { label: "home", href: "/" },
    { label: "Classes Terapêuticas", href: "/classes-terapeuticas" },
    {
      label: therapeuticClass.paramsVowel,
      href: `/classes-terapeuticas/${therapeuticClass.paramsVowel}`,
    },
  ];

  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <BreadcrumbOptimized breadcrumbs={breadcrumbs} pageInfo={pageInfo} />
      <div>
        <div>
          <div>
            <h1 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
              Classes com a letra:{" "}
              <span class="uppercase">{therapeuticClass.paramsVowel}</span>
              {pageInfo.currentPage > 1 && (
                <span>- Página {pageInfo.currentPage}</span>
              )}
            </h1>

            <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
              {therapeuticClass?.items
                ?.slice(currentPage * 40, pageInfo.currentPage * 40)
                .map((therapeutic) => (
                  <li class="border-b border-neutral py-4">
                    <a
                      title={therapeutic?.customerTitle ??
                        therapeutic.therapeuticClassName ??
                        ""}
                      href={`/b/${therapeutic?.slug?.replace("-root", "")}`}
                      class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                    >
                      {therapeutic.therapeuticClassName}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {therapeuticClass.items.length && (
        <Pagination
          pageInfo={pageInfo}
          pathPrevius={`/classes-terapeuticas/${therapeuticClass.paramsVowel}`}
        />
      )}
    </section>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  if (props.therapeuticClass?.items.length < 1) {
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
