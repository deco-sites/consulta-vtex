import type { Product } from "../../commerce/types.ts";
import Icon from "../../components/ui/Icon.tsx";

interface Props {
  product: Product;
  parentProducts: Product[];
}

function ProductSimiliars({ product, parentProducts }: Props) {
  const parentProductsFiltered = parentProducts
    ?.filter(
      (product) =>
        product?.additionalProperty?.find(
          (property) => property.name === "Spot" && property.value,
        )?.value,
    )
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name),
    );

  return parentProductsFiltered.length > 1
    ? (
      <div class="max-lg:px-3 max-lg:py-2">
        <p class="text-base font-bold mb-2">Selecione a variação do produto</p>
        <details class="border border-black py-1 px-3 rounded relative group">
          <summary class="list-none marker:list-none cursor-pointer flex items-center gap-4 justify-between">
            {product.name}
            <Icon
              class="w-5 h-5 group-open:rotate-180 duration-300 min-w-5"
              id="ArrowDown"
              sizes="20"
              stroke="1"
            />
          </summary>
          <ul
            id="overflow-variants"
            class="absolute border z-10 py-1 border-black rounded-b w-[calc(100%+2px)] -left-[1px] bg-white border-t-0 max-h-52 overflow-y-auto"
          >
            {parentProductsFiltered?.map((productParent) => {
              const productParentLink = productParent?.additionalProperty?.find(
                (property) => property.name === "Spot" && property.value,
              );

              return (
                productParent.name !== product.name && (
                  <li key={productParent.productID}>
                    <a
                      href={productParentLink?.value?.replace(
                        "https://consultaremedios.com.br",
                        "",
                      )}
                      class="px-3 hover:bg-gray-100 duration-300 block py-1"
                    >
                      {productParent.name}
                    </a>
                  </li>
                )
              );
            })}
          </ul>
        </details>
      </div>
    )
    : <></>;
}

export default ProductSimiliars;
