interface Props {
  pageInfo: {
    currentPage: number;
    nextPage: string | undefined;
    previousPage: string | undefined;
    records: number;
    recordPerPage?: number | undefined;
    totalPages?: number | undefined;
  };
  pathPrevius: string;
}

function Pagination({ pageInfo, pathPrevius }: Props) {
  const zeroIndexedOffsetPage = pageInfo.currentPage - 1;

  const currentPage = pageInfo?.currentPage ? pageInfo?.currentPage - 1 : 1;
  return (
    <div class="flex justify-center my-8 ">
      <div class="flex flex-col justify-center items-center">
        <div class="w-fit border border-neutral rounded-lg flex items-center justify-center">
          {pageInfo.previousPage
            ? (
              <>
                <a
                  aria-label="page link"
                  href={`${pathPrevius}`}
                  class={`text-primary border-r border-neutral px-4  flex items-center h-12 ${
                    pageInfo.previousPage
                      ? "hover:bg-slate-100 duration-300"
                      : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ‹‹
                </a>
                <a
                  aria-label="page previus link"
                  href={pageInfo.previousPage == "?pagina=1"
                    ? pathPrevius
                    : pageInfo.previousPage}
                  class={`btn btn-ghost join-item text-primary rounded-none ${
                    pageInfo.previousPage
                      ? ""
                      : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ‹
                </a>
              </>
            )
            : (
              <>
                {" "}
                <p
                  class={`text-primary border-r border-neutral px-4  flex items-center h-12 ${
                    pageInfo.previousPage
                      ? "hover:bg-slate-100 duration-300"
                      : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ‹‹
                </p>
                <p
                  class={`btn btn-ghost join-item text-primary rounded-none ${
                    pageInfo.previousPage
                      ? ""
                      : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ‹
                </p>
              </>
            )}

          <span class="border-l border-r border-neutral px-6 h-12 flex items-center">
            {zeroIndexedOffsetPage + 1}
          </span>
          {pageInfo.nextPage
            ? (
              <>
                <a
                  aria-label="page next link"
                  href={pageInfo.nextPage ?? "#"}
                  class={`btn btn-ghost join-item text-primary rounded-none ${
                    pageInfo.nextPage ? "" : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ›
                </a>
                <a
                  aria-label="page link"
                  href={`?pagina=${pageInfo.totalPages}`}
                  class={` text-primary border-l border-neutral px-4 h-12 flex items-center  ${
                    pageInfo.nextPage
                      ? "hover:bg-slate-100 duration-300"
                      : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ››
                </a>
              </>
            )
            : (
              <>
                <p
                  class={`btn btn-ghost join-item text-primary rounded-none ${
                    pageInfo.nextPage ? "" : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ›
                </p>
                <p
                  class={` text-primary border-l border-neutral px-4 h-12 flex items-center  ${
                    pageInfo.nextPage
                      ? "hover:bg-slate-100 duration-300"
                      : "pointer-events-none bg-gray-100"
                  }`}
                >
                  ››
                </p>
              </>
            )}
        </div>

        <div class="mt-4">
          <p>
            <span class="font-semibold">Atual:</span>{" "}
            <span>
              {currentPage == 0
                ? "1"
                : (pageInfo?.recordPerPage ?? 40) * currentPage + 1} até{" "}
              {pageInfo?.nextPage
                ? pageInfo.currentPage * 40
                : pageInfo.records}
            </span>
            <span class="mx-1">|</span>
            <span class="font-semibold">Total:</span>
            <span>{pageInfo?.records} registros</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
