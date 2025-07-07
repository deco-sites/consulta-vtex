import type { ListingFromAtoZ } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import NotFound from "../../sections/Product/NotFound.tsx";
import Pagination from "../../components/search/Pagination.tsx";
import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
export interface Link {
  label?: string;
  href?: string;
}
/** @title Listagem de A a Z */
export interface ListAtoZ {
  list?: Link[];
}

export interface Props {
  factory: ListingFromAtoZ;
}

function ListingFromAtoZ({ factory }: Props) {
  if (factory?.items.length < 1) {
    return <NotFound />;
  }

  const { pageInfo } = factory;

  const currentPage = pageInfo?.currentPage ? pageInfo?.currentPage - 1 : 1;

  const breadcrumbs = [
    { label: "home", href: "/" },
    { label: "Fabricantes", href: "/fabricantes" },
    {
      label: factory.paramsVowel,
      href: `/fabricantes/${factory.paramsVowel}`,
    },
  ];

  return (
    <section class="max-w-[1336px] lg:px-5 m-auto py-6 lg:py-8">
      <BreadcrumbOptimized breadcrumbs={breadcrumbs} pageInfo={pageInfo} />

      <div>
        <div>
          <div>
            <h1 class="text-[1.75rem] font-medium tracking-[-.09375rem] leading-tight text-info pt-6 max-lg:px-4">
              Fabricantes com a letra:{" "}
              <span class="uppercase">{factory.paramsVowel}</span>
              {pageInfo.currentPage > 1 && (
                <span>- Página {pageInfo.currentPage}</span>
              )}
            </h1>

            <ul class="grid grid-cols-1 lg:grid-cols-4 gap-x-6 py-6 lg:cent">
              {factory?.items
                ?.slice(currentPage * 40, pageInfo.currentPage * 40)
                .map((item) => (
                  <li class="border-b border-neutral py-4">
                    <a
                      title={item?.customerTitle ?? item.commercialName ?? ""}
                      href={`/fabricante/${item.slug}`}
                      class="block leading-normal tracking-[.009375rem] text-info hover:underline  max-lg:px-4"
                    >
                      <img
                        width={144}
                        height={72}
                        src={item.thumbnail ??
                          "https://assets.decocache.com/consul-remedio/5a18dfc3-375a-4bc9-8721-00b5d23da66d/Favicon-Consutla-Remedios.svg"}
                        alt={item.factoryName}
                        class="h-[72px] mb-2 mx-auto"
                      />
                      {item.commercialName}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {factory.items.length && (
        <Pagination
          pageInfo={pageInfo}
          pathPrevius={`/fabricantes/${factory.paramsVowel}`}
        />
      )}
    </section>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  if (props.factory?.items.length < 1) {
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
