import { AppContext } from "../../apps/site.ts";
import NotFound from "../../sections/Product/NotFound.tsx";
import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
import Pagination from "../../components/search/Pagination.tsx";
import type { ListingFromAtoZ } from "../../commerce/types.ts";
export interface Link {
  label?: string;
  href?: string;
}
/** @title Listagem de A a Z */
export interface ListAtoZ {
  list?: Link[];
}

export interface Props {
  brands: ListingFromAtoZ;
}

function ListingFromAtoZ({ brands }: Props) {
  if (brands?.items.length < 1) {
    return <NotFound />;
  }

  const { pageInfo } = brands;

  const currentPage = pageInfo?.currentPage ? pageInfo?.currentPage - 1 : 1;

  const breadcrumbs = [
    { label: "home", href: "/" },
    { label: "Marcas", href: "/marcas" },
    {
      label: brands.paramsVowel,
      href: `/marcas/${brands.paramsVowel}`,
    },
  ];

  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <BreadcrumbOptimized breadcrumbs={breadcrumbs} pageInfo={pageInfo} />
      <div>
        <div>
          <div>
            <h1 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
              Marcas com a letra:{" "}
              <span class="uppercase">{brands.paramsVowel}</span>
              {pageInfo.currentPage > 1 && (
                <span>- Página {pageInfo.currentPage}</span>
              )}
            </h1>

            <ul class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 py-6">
              {brands?.items
                ?.slice(currentPage * 40, pageInfo.currentPage * 40)
                .map((brand) => (
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
          </div>
        </div>
      </div>

      {brands.items.length && (
        <Pagination
          pageInfo={pageInfo}
          pathPrevius={`/marcas/${brands.paramsVowel}`}
        />
      )}
    </section>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  if (props.brands?.items.length < 1) {
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
