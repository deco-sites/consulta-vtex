import Icon from "../../../components/ui/Icon.tsx";
import { ProductOfferShippingQuote } from "./ProductBuyBox.tsx";
import { formatarTextoParaHref, formatPriceNew } from "../../../sdk/format.ts";
import { Product } from "../../../commerce/types.ts";
import PriceOffer from "./PriceOffer.tsx";
import SelectQuantity from "./SelectQuantity.tsx";
import { Signal } from "@preact/signals";
import { useUI } from "../../../sdk/useUI.ts";
import { useCart } from "apps/wake/hooks/useCart.ts";
interface Props {
  bestOfferRegion: ProductOfferShippingQuote | null | undefined;
  worseOfferQuotes: ProductOfferShippingQuote | null | undefined;
  product: Product;
  title: string;
  selected: Signal<string>;
  name: string;
  description: string;
  pricePerMeasureMedicine?:
    | {
      measure: string | null | undefined;
      quantidadeDivisoria: number | null;
    }
    | false;
}

function ProductBuyBoxNoCep({
  bestOfferRegion,
  worseOfferQuotes,
  product,
  title,
  name,
  selected,
  description,
  pricePerMeasureMedicine,
}: Props) {
  const { pmcValue, displayShippingDrawer, sellerIdValue } = useUI();
  const bestPrice = bestOfferRegion?.offer.price;
  const worsePrice = pmcValue.value > 0
    ? pmcValue.value
    : worseOfferQuotes?.offer.price;

  const quantity = product.additionalProperty?.find(
    (property) => property.name === "Quantidade na embalagem" && property.value,
  );

  const medicineType = product.additionalProperty?.find(
    (property) => property.name === "Forma Farmacêutica" && property.value,
  );

  const today = new Date();
  const future = new Date(today);
  future.setDate(today.getDate() + (bestOfferRegion?.deadline ?? 0));

  const dayWeekend = future.toLocaleDateString("pt-BR", { weekday: "long" });
  const month = future.toLocaleDateString("pt-BR", { month: "long" });
  const day = future.getDate();

  function openDrawer() {
    sellerIdValue.value = bestOfferRegion?.distributionCenterId ?? 0;
    displayShippingDrawer.value = true;
  }

  const { cart } = useCart();
  const { products } = cart.value;

  const isOfferCart = products?.find(
    (item) => item?.seller?.sellerName === bestOfferRegion?.offer?.name,
  );

  return (
    <div>
      {name == selected.value
        ? (
          <div class="p-2 lg:px-4 lg:py-2 border-[2px] border-secondary-content rounded-lg">
            <div class="flex gap-2 items-center">
              <Icon
                id={name}
                width={32}
                height={32}
                strokeWidth={0.01}
                class="cursor-pointer"
              />
              <span class="text-sm font-bold text-accent-content">{title}</span>
              <div class="relative icon-info group">
                <Icon
                  id="Info"
                  width={14}
                  height={14}
                  strokeWidth={0.01}
                  class="cursor-pointer "
                />
                <div class="hidden group-hover:block absolute bottom-6 font-light text-center bg-black text-white z-10 text-sm w-52 py-1 px-4 rounded-lg -left-1/2 -translate-x-1/2">
                  {description}
                  {" "}
                </div>
              </div>
            </div>
            <PriceOffer
              bestPrice={bestPrice}
              worsePrice={worsePrice}
              quantity={quantity}
              medicineType={medicineType}
              pricePerMeasureMedicine={pricePerMeasureMedicine}
            />
            {bestOfferRegion && (
              <div class="px-2 py-2">
                <div class="text-info font-light text-sm">
                  {bestOfferRegion.name.includes("|")
                    ? (
                      <span>
                        Clique & Retire: {future.getDate() === today.getDate()
                          ? (
                            <span>
                              <span class="font-medium">Hoje</span>
                              {" "}
                            </span>
                          )
                          : <span>{dayWeekend}</span>}
                      </span>
                    )
                    : today.getDate() === future.getDate()
                    ? (
                      <span>
                        Chegará <span class="font-medium">Hoje</span>,
                      </span>
                    )
                    : <span>Chegará</span>}{" "}
                  <span class="font-medium">
                    {bestOfferRegion?.deadline !== 1 &&
                        future.getDate() !== today.getDate()
                      ? dayWeekend
                      : "amanhã"}
                    , {day} de {month},
                  </span>{" "}
                  {bestOfferRegion?.value === 0
                    ? (
                      <span class="text-success uppercase font-medium">
                        {" "}
                        GRÁTIS
                      </span>
                    )
                    : isOfferCart
                    ? <span>Frete incluso</span>
                    : (
                      <span>
                        {" "}
                        por {formatPriceNew(bestOfferRegion?.value ?? 0)}
                      </span>
                    )}
                </div>
                {bestOfferRegion.name.includes("|") && (
                  <div class="text-secondary font-light text-xs flex gap-1 py-1">
                    <span>
                      Endereço:{" "}
                      <a
                        target="_blank"
                        class="underline"
                        href={`https://www.google.com/maps/search/${
                          bestOfferRegion?.name?.replace(
                            "R |",
                            "",
                          )
                        }`}
                      >
                        {" "}
                        {bestOfferRegion?.name?.replace("R |", "")}
                      </a>
                    </span>
                  </div>
                )}

                <button
                  onClick={() => openDrawer()}
                  class="text-sm text-primary font-light bg-transparent underline leading-normal"
                >
                  Mais formas de entrega
                </button>
                <SelectQuantity
                  bestOfferRegion={bestOfferRegion}
                  product={product}
                />
                <div class="text-secondary font-light text-xs flex flex-col gap-1">
                  <div class="flex w-full justify-between gap-2">
                    {" "}
                    Vendido e entregue por {
                      /* <a
                    href={`/lojas/${formatarTextoParaHref(
                      bestOfferRegion.offer.name ?? ""
                    )}`}
                    class="text-secondary underline hover:text-info duration-300"
                  >
                    {bestOfferRegion.offer.name}
                  </a> */
                    }
                    <p class="text-secondary hover:text-info duration-300">
                      {bestOfferRegion.offer.name}
                    </p>
                  </div>
                  <div class="flex w-full justify-between gap-2">
                    <span>Preço unitário</span>
                    <span>
                      R$ {formatPriceNew(bestOfferRegion?.offer.price ?? 0)}
                    </span>
                  </div>
                  <div class="flex w-full justify-between gap-2">
                    <span>Impostos, taxas e serviço</span>
                    <span class="text-success uppercase text">Grátis</span>
                  </div>
                  <div class="flex w-full justify-between gap-2">
                    <span>Frete</span>
                    {bestOfferRegion?.value == 0
                      ? <span class="text-success uppercase text">Grátis</span>
                      : isOfferCart
                      ? <span>Incluso</span>
                      : (
                        <span>
                          R$ {formatPriceNew(bestOfferRegion?.value ?? 0)}
                        </span>
                      )}
                  </div>
                  {bestPrice && (
                    <div class="flex w-full justify-between gap-2 text-info text-sm">
                      <span>Preço final</span>
                      <span>
                        R$ {formatPriceNew(
                          (isOfferCart ? 0 : bestOfferRegion?.value) +
                            bestPrice,
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
        : (
          <div
            class="cursor-pointer flex items-center gap-3 p-4 border border-transparent hover:border-info rounded-lg"
            onClick={() => (selected.value = name)}
          >
            <div class="flex gap-2 items-center">
              <Icon
                id={name}
                width={32}
                height={32}
                strokeWidth={1}
                class="cursor-pointer"
              />
            </div>
            <div class="flex flex-col w-full gap-2">
              <div class="flex w-full justify-between items-center">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-accent-content">
                    {title}
                  </span>
                  <div class="relative icon-info group">
                    <Icon
                      id="Info"
                      width={14}
                      height={14}
                      strokeWidth={0.01}
                      class="cursor-pointer "
                    />
                    <div class="hidden group-hover:block absolute bottom-6 font-light text-center bg-black text-white z-10 text-sm w-52 py-1 px-4 rounded-lg -left-1/2 -translate-x-1/2">
                      {description}
                      {" "}
                    </div>
                  </div>
                </div>
                {bestPrice && (
                  <div class="flex gap-1 items-end">
                    <div class="text-sm flex gap-1 items-start leading-[21px]">
                      R${" "}
                      <span class="text-2xl font-medium text-info leading-[1.2]">
                        {formatPriceNew(bestPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div class="text-info font-light text-sm">
                {bestOfferRegion?.name.includes("|")
                  ? (
                    <span>
                      Clique & Retire:{" "}
                      {future.getDate() === today.getDate() && (
                        <span>
                          <span class="font-medium">Hoje</span>
                        </span>
                      )}
                    </span>
                  )
                  : future.getDate() === today.getDate()
                  ? (
                    <span>
                      Chegará <span class="font-medium">Hoje</span>
                    </span>
                  )
                  : <span>Chegará</span>}{" "}
                <span class="font-medium">
                  {bestOfferRegion?.deadline !== 1 &&
                      future.getDate() !== today.getDate()
                    ? dayWeekend
                    : "amanhã"}
                  , {day} de {month},
                </span>{" "}
                {name.includes("|") || bestOfferRegion?.value == 0
                  ? (
                    <span class="text-success uppercase font-medium">
                      GRÁTIS
                    </span>
                  )
                  : isOfferCart
                  ? <span>Frete incluso</span>
                  : (
                    <span>
                      por {formatPriceNew(bestOfferRegion?.value ?? 0)}
                    </span>
                  )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ProductBuyBoxNoCep;
