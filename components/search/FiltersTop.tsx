import Avatar from "../../components/ui/Avatar.tsx";
import { formatPrice } from "../../sdk/format.ts";
import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import Icon from "../../components/ui/Icon.tsx";
import { useSignal } from "@preact/signals";
import ValueItem from "../../islands/ValueItem.tsx";

interface Props {
  filters: ProductListingPage["filters"];
}

export const parseRange = (price: string) => {
  const splitted = price.split("-");

  const from = Number(splitted?.[0]);
  const to = Number(splitted?.[1]);

  return Number.isNaN(from) || Number.isNaN(to) ? null : { from, to };
};

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

// function ValueItem({ url, selected, label }: FilterToggleValue) {
//   return (
//     <a href={url} rel="nofollow" class="flex items-center gap-2">
//       <div
//         aria-checked={selected}
//         class="checkbox rounded border-neutral w-5 h-5"
//       />
//       <span class="text-sm">{label}</span>
//       {/* {quantity > 0 && <span class="text-sm text-info-300">({quantity})</span>} */}
//     </a>
//   );
// }

function FilterValues({ key, values }: FilterToggle) {
  const flexDirection = key === "tamanho" || key === "cor"
    ? "flex-row"
    : "flex-col";

  return (
    <ul class={`flex flex-wrap gap-2 ${flexDirection}`}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (key === "cor" || key === "tamanho") {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "precoPor") {
          const range = parseRange(item.value);

          return (
            range && (
              <ValueItem
                {...item}
                label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
              />
            )
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

function FiltersTop({ filters }: Props) {
  const filteredFilters = filters.filter(
    (filter) => filter.label === "Preço" || filter.label === "Marca",
  );

  const openIndex = useSignal<number | null>(null);

  const toggleDetails = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index;
  };
  return (
    <ul class="flex flex-row gap-4">
      {filteredFilters.filter(isToggle).map((filter, index) => (
        <details
          key={index}
          open={openIndex.value === index}
          onClick={(e) => {
            e.preventDefault();
            toggleDetails(index);
          }}
          class={`flex flex-col group bg-[#F8F9FA] rounded lg:relative ${
            filter.label === "Preço" ? "hidden" : ""
          }`}
        >
          <summary class="group-open:bg-gray-200 p-2 gap-3 flex w-full justify-between cursor-pointer list-none marker:list-none text-base leading-normal items-center rounded">
            {filter.label === "Preço"
              ? <Icon id="IconPrice" size={24} stroke="1" />
              : <Icon id="Diamond" size={16} stroke="1" />}

            <span class="text-secondary">{filter.label}</span>
            <Icon
              class="w-4 h-4 group-open:rotate-180 duration-300 min-w-5 opacity-90"
              id="ArrowGray"
              sizes="16"
              stroke="1"
            />
          </summary>
          <div
            onClick={(e) => e.stopPropagation()}
            class="p-4 pb-2 max-h-56 overflow-y-auto font-bold absolute bg-white z-10 lg:w-80 border border-neutral rounded top-11 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:top-[64px]"
          >
            <FilterValues {...filter} />
          </div>
        </details>
      ))}
    </ul>
  );
}

export default FiltersTop;
