import Avatar from "../../components/ui/Avatar.tsx";
import { formatPrice } from "../../sdk/format.ts";
import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import ValueItem from "../../islands/ValueItem.tsx";
import Icon from "../../components/ui/Icon.tsx";
import RemoveFilter from "deco-sites/consul-remedio/islands/RemoveFilter.tsx";

interface Props {
  filters: ProductListingPage["filters"];
  filtersActive: string[] | undefined;
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
//   // console.log("url", url);

//   function handleClick() {
//     console.log("url", url);
//     globalThis.window.location = url;
//   }

//   return (
//     <div onClick={handleClick} class="flex items-center gap-2">
//       <div
//         aria-checked={selected}
//         class="checkbox rounded border-neutral w-5 h-5"
//       ></div>
//       <span class="text-sm">{label}</span>
//     </div>
//   );
//}

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

function Filters({ filters, filtersActive }: Props) {
  const arrayDiscartedFilter = [
    "Tipo de receita",
    "Classe terapêutica",
    "Forma Farmacêutica",
    "Categoria",
    "Dosagem",
    "Marca",
    "Fabricante",
    "Princípio ativo",
    "Tipo do medicamento",
    "Quantidade na embalagem",
    "Vendedores",
  ];

  const filteredFilters = filters.filter(
    (filter) =>
      arrayDiscartedFilter.includes(filter.label) &&
      Array.isArray(filter.values) &&
      filter.values.length > 1,
  );

  return (
    <ul class="flex flex-col lg:mr-4">
      <RemoveFilter filterNames={filtersActive} />
      {filteredFilters.filter(isToggle).map((filter) => (
        <details class="flex py-4 px-3 flex-col border-b border-base-300 group">
          <summary class=" flex w-full justify-between cursor-pointer list-none marker:list-none text-base font-bold leading-normal text-[#000000de] ">
            <span>{filter.label}</span>
            <Icon
              class="w-5 h-5 group-open:rotate-180 duration-300 min-w-5"
              id="ArrowDown"
              sizes="20"
              stroke="1"
            />
          </summary>
          <div class="pt-4 pb-2 max-h-56 overflow-y-auto">
            <FilterValues {...filter} />
          </div>
        </details>
      ))}
    </ul>
  );
}

export default Filters;
