import { useMemo } from "preact/hooks";
import { ProductListingPage } from "apps/commerce/types.ts";
import type { JSX } from "preact";

const SORT_QUERY_PARAM = "sort";

const useSort = () =>
  useMemo(() => {
    const urlSearchParams = new URLSearchParams(globalThis.location?.search);
    return urlSearchParams.get(SORT_QUERY_PARAM) ?? "";
  }, []);

// TODO: Replace with "search utils"
const applySort = (e: JSX.TargetedEvent<HTMLSelectElement, Event> | string) => {
  const value = typeof e === "string" ? e : e.currentTarget.value;
  const urlSearchParams = new URLSearchParams(globalThis.location.search);

  urlSearchParams.set(SORT_QUERY_PARAM, value);
  globalThis.location.search = urlSearchParams.toString();
};

export type Props = Pick<ProductListingPage, "sortOptions">;

// TODO: move this to the loader
const portugueseMappings = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  // "release:desc": "Relevância - Decrescente",
  "discount:desc": "Maior desconto",
};

function Sort({ sortOptions }: Props) {
  const sort = useSort();

  const handleSortChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const selectedValue = event.currentTarget.value;
    applySort(selectedValue);
  };

  return (
    <details class="group lg:relative text-secondary">
      <summary class=" flex items-center px-4 py-2 bg-[#F8F9FA] rounded-lg hover:bg-gray-300 focus:outline-none cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.5 15c.133 0 .26-.053.354-.147.094-.094.147-.221.147-.354V2.706l3.146 3.147a.5.5 0 0 0 .707-.707L11.854 1.146a.502.502 0 0 0-.708 0L7.146 5.146a.5.5 0 1 0 .708.708L11 2.706V14.5c0 .132.053.26.147.354.094.094.221.146.353.146ZM4.5 1a.5.5 0 0 1 .5.5v11.793L8.146 10.146a.5.5 0 0 1 .708.708L4.854 14.854a.502.502 0 0 1-.708 0L.146 10.854a.5.5 0 1 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5Z"
            fill="black"
          >
          </path>
        </svg>
        <span class="ml-2 mr-2 flex text-nowrap">
          Ordenar por:{" "}
          <span class="ml-1">
            {sortOptions?.find(({ value }) => value === sort)?.label ||
              "Selecione"}
          </span>
        </span>{" "}
        <svg
          class="group-open:rotate-180 duration-300"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708Z"
            fill="black"
          >
          </path>
        </svg>
      </summary>
      <div class="absolute w-full max-lg:max-w-[80%] lg:left-0 mt-2  bg-white shadow-lg rounded-lg p-3 z-10 max-lg:right-4">
        <ul class="flex flex-col space-y-3">
          {sortOptions?.map(({ value, label }) => {
            if (
              value != "DISCOUNT:DESC" &&
              value != "PRICE:ASC" &&
              value != "PRICE:DESC"
            ) {
              return (
                <li key={value} class="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={value}
                    name="sort"
                    value={value}
                    checked={value === sort}
                    onChange={handleSortChange}
                    class="cursor-pointer accent-primary"
                  />
                  <label htmlFor={value} class="cursor-pointer">
                    {portugueseMappings[
                      label as keyof typeof portugueseMappings
                    ] ?? label}
                  </label>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </details>
  );
}

export default Sort;
