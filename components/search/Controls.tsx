import Button from "../../components/ui/Button.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Filters from "../../components/search/Filters.tsx";
import FiltersTop from "../../components/search/FiltersTop.tsx";
import Sort from "../../islands/Sort.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import type { ProductListingPage } from "../../commerce/types.ts";
import PageInfoDisplaySearch from "./PageInfoDisplaySearch.tsx";
import PageInfoDisplayCategory from "./PageInfoDisplayCategory.tsx";
import CategoryList from "./CategoryList.tsx";

export type Props =
  & Pick<
    ProductListingPage,
    "filters" | "breadcrumb" | "sortOptions"
  >
  & {
    displayFilter?: boolean;
  }
  & { page: ProductListingPage };

function SearchControls({
  filters,
  breadcrumb,
  displayFilter,
  sortOptions,
  page,
}: Props) {
  const hasBusca =
    breadcrumb?.itemListElement.some((element) =>
      element.item.includes("busca")
    ) && !page.contentSeoSubstance?.isSubstance;

  const scrollToContent = (e: Event) => {
    e.preventDefault();
    const element = document.getElementById("bula");
    if (element) {
      const topPosition = element.getBoundingClientRect().top +
        globalThis.window.scrollY;
      globalThis.window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
    }
  };

  const html = (page?.contentSeoSubstance?.substanceAttribute?.length || 0) > 0
    ? page?.contentSeoSubstance?.substanceAttribute[0].value
    : "";

  const textClean = html?.replace(/<[^>]+>/g, "").trim();

  return (
    <>
      <input id="filter-toggle" type="checkbox" className="hidden peer" />
      {/* Overlay */}
      <label
        htmlFor="filter-toggle"
        class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto lg:hidden"
      />

      {/* Sidebar */}
      <div class="fixed inset-y-0 left-0 z-50 bg-white overflow-auto lg:hidden
    w-full max-w-[400px]
    transform-gpu
    transition-all duration-300 ease-in-out
    opacity-0 translate-x-[-100%] pointer-events-none
    peer-checked:opacity-100 peer-checked:translate-x-0 peer-checked:pointer-events-auto">
        <div class="flex flex-col h-full divide-y">
          <div class="flex justify-between items-center px-4 py-3 border-b">
            <span class="font-medium text-lg">Filtros</span>
            <label htmlFor="filter-toggle">
              <Icon id="XMark" size={24} strokeWidth={2} />
            </label>
          </div>
          <div class="flex-grow overflow-auto pb-4">
            <Filters filters={filters} filtersActive={page.filtersActive} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class="flex justify-center flex-col max-lg:px-4 max-lg:pt-5 gap-4 lg:gap-8">
        <Breadcrumb itemListElement={breadcrumb?.itemListElement} />

        <div>
          {hasBusca
            ? <PageInfoDisplaySearch page={page} />
            : <PageInfoDisplayCategory page={page} />}

          {(page?.contentSeoSubstance?.substanceAttribute.length ?? 0) > 0 && (
            <div class="py-5 border-b border-neutral">
              <p class="text-lg line-clamp-3">{textClean}</p>
              <a
                onClick={scrollToContent}
                class="text-primary underline block mt-3 hover:text-info"
                href="#bula"
              >
                Ler mais
              </a>
            </div>
          )}

          {page.thumbmails && <CategoryList items={page.thumbmails} />}
        </div>
      </div>

      {page.products && page.products.length > 0 && (
        <div class="max-lg:relative flex flex-col justify-between mb-4 p-4 lg:mb-0 lg:p-0 lg:gap-4 lg:flex-row lg:h-[53px]">
          <div class="flex flex-row items-center justify-between border-b border-base-200 lg:gap-4 lg:border-none w-full max-lg:overflow-x-auto max-lg:pb-2 gap-4">
            {/* Filter Toggle Button */}
            <label
              htmlFor="filter-toggle"
              class={displayFilter
                ? "btn-ghost"
                : "btn-ghost p-2 gap-3 max-lg:flex w-full justify-between cursor-pointer text-base leading-normal rounded items-center lg:hidden bg-[#F8F9FA] text-secondary"}
            >
              <Icon id="FilterList" width={16} height={16} />
              Filtrar
              <Icon
                class="w-4 h-4 min-w-5 opacity-90"
                id="ArrowGray"
                sizes="16"
                stroke="1"
              />
            </label>

            <div>
              <FiltersTop filters={filters} />
            </div>

            {sortOptions.length > 0 && <Sort sortOptions={sortOptions} />}
          </div>
        </div>
      )}
    </>
  );
}

export default SearchControls;
