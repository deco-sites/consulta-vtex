import { useSignal } from "@preact/signals";
import ButtonBuy from "../../../islands/AddToCartButton/wake.tsx";
import { Product } from "../../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../../commerce/utils/productToAnalyticsItem.ts";
import { ProductOfferShippingQuote } from "./ProductBuyBox.tsx";

interface Props {
  bestOfferRegion: ProductOfferShippingQuote | null | undefined;
  product: Product;
}

function SelectQuantity({ bestOfferRegion, product }: Props) {
  const isOpen = useSignal(false);
  const selected = useSignal("1 unidade");
  const quantity = useSignal(1);

  const customQuantity = useSignal("");
  const inventory = bestOfferRegion?.offer?.inventory;
  const maxDisplay = Math.min(inventory ?? 1, 6);

  const options = Array.from(
    { length: maxDisplay },
    (_, i) => `${i + 1} unidade${i + 1 > 1 ? "s" : ""}`,
  );
  if ((inventory ?? 1) > 6) {
    options.push("Mais de 6 unidades");
  }

  function toggleDropdown() {
    isOpen.value = !isOpen.value;
  }

  function selectOption(option: string, event: Event) {
    event.stopPropagation();
    selected.value = option;
    isOpen.value = false;

    if (option === "Mais de 6 unidades") {
      quantity.value = 1;
    } else {
      const parsedQuantity = parseInt(option.split(" ")[0], 10);
      quantity.value = isNaN(parsedQuantity) ? 6 : parsedQuantity;
    }
  }

  function applyCustomQuantity() {
    const parsedQuantity = parseInt(customQuantity.value, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      quantity.value = parsedQuantity;
    }
  }

  // console.log("bests", bestOfferRegion);
  // const { productID } = product;

  const productID = bestOfferRegion?.offer?.productID;

  const price = bestOfferRegion?.offer.price;
  const listPrice = bestOfferRegion?.offer.listPrice;

  const eventItem = mapProductToAnalyticsItem({
    product,
    price,
    listPrice,
  });

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    customQuantity.value = target.value;
  }

  return (
    <div class="relative w-full font-light text-info pb-2 pt-4">
      {selected.value === "Mais de 6 unidades"
        ? (
          <div class="flex items-center gap-2 border border-neutral rounded p-1 w-full">
            <input
              class="w-full p-1 borde-none outline-none"
              placeholder="Digite a quantidade"
              value={customQuantity.value}
              onInput={handleInputChange}
            />
            <button
              class="bg-primary text-white px-4 py-2 rounded font-light text-xs h-full hover:bg-accent duration-300 hover:scale-90"
              onClick={applyCustomQuantity}
            >
              Aplicar
            </button>
          </div>
        )
        : (
          <div
            class="flex items-center justify-between cursor-pointer w-full border border-neutral rounded p-2 bg-white"
            role="button"
            aria-expanded={isOpen.value}
            onClick={toggleDropdown}
          >
            {selected.value}

            <img
              class="w-3"
              width="12"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZklEQVR4nO3QMQqAQAxE0X8JxfvfQ2vFzsbjKIJbitlNos18GEj3IKCUUsrRBBzBGy3wkgDPFrgDtkB0Bwbru6PwKjQKb0K9uAttxUPQWjwUteIp6Bueij7hn6ClHljvXbdSit86AUl3ltPxBzVwAAAAAElFTkSuQmCC"
              alt="sort-down"
            />
          </div>
        )}

      {isOpen.value && (
        <div class="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 py-2">
          {options?.map((option) => (
            <p
              key={option}
              class="px-2 py-1 text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={(event) => selectOption(option, event)}
            >
              {option}
            </p>
          ))}
        </div>
      )}
      {inventory && (
        <p class="mt-1 text-xs text-secondary">
          (+{inventory > 99 ? 99 : inventory} Disponíveis)
        </p>
      )}
      <div class="py-2">
        <ButtonBuy
          eventParams={{ items: [eventItem] }}
          productID={productID!}
          quantity={quantity.value}
          product={product}
          offer={bestOfferRegion}
        />
      </div>
    </div>
  );
}

export default SelectQuantity;
