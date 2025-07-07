import { Props } from "./SearchResult.tsx";
import { ProductListingPage } from "../../commerce/types.ts";

const PageInfoDisplaySearch = ({
  page,
}: Omit<Props, "page"> & { page: ProductListingPage }) => {
  const { pageInfo, breadcrumb, titlePage, descriptionPage } = page;
  const lastIndex = breadcrumb.itemListElement.length - 1;
  const lastElement = breadcrumb.itemListElement[lastIndex];

  // console.log(pageInfso);
  // console.log(breadcrumb);

  return (
    <div class="pb-5 lg:pb-8 text-secondary border-b">
      <div class=" flex items-end gap-2 ">
        {titlePage
          ? (
            <>
              <h1 class="text-xl lg:text-3xl text-info font-medium">
                {titlePage}
              </h1>
            </>
          )
          : (
            <h1 class="text-xl lg:text-3xl text-info font-medium">
              Resultados para{" "}
              <span class="text-[#0C0B0B] capitalize">
                "
                {decodeURIComponent(
                  lastElement?.name?.replace(/[/,]/g, "").replace(/-/g, " ") ??
                    "",
                )}
                "
              </span>
            </h1>
          )}

        <span>({pageInfo.records})</span>
      </div>

      {descriptionPage && (
        <div
          class="pt-5 lg:text-lg"
          dangerouslySetInnerHTML={{ __html: descriptionPage }}
        >
        </div>
      )}
    </div>
  );
};

export default PageInfoDisplaySearch;
