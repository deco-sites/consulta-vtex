import Icon from "deco-sites/consul-remedio/components/ui/Icon.tsx";
import { formatPriceNew } from "../../../sdk/format.ts";
import { useUI } from "../../../sdk/useUI.ts";
import { OfferSellers } from "../../../commerce/types.ts";
interface Props {
  bestOffer: number | null;
  productOffers: OfferSellers[];
  offerExclusive: number | null;
  offerPriceExclusive: number | null;
}

function ProductBuyBoxNoCep({
  bestOffer,
  productOffers,
  offerExclusive,
  offerPriceExclusive,
}: Props) {
  const { displayCepDrawer } = useUI();

  return (
    <div class="p-2 lg:p-4 border-[2px] border-cecondary-content rounded-lg">
      <div class="flex gap-2 items-center">
        <Icon
          id="BestOffer"
          width={32}
          height={32}
          strokeWidth={0.01}
          class="cursor-pointer"
        />
        <span class="text-sm font-bold text-accent-content">Melhor Oferta</span>
        <Icon
          id="Info"
          width={14}
          height={14}
          strokeWidth={0.01}
          class="cursor-pointer"
        />
      </div>

      <div class="px-2 py-4">
        {productOffers?.length > 0
          ? (
            <div>
              {!offerPriceExclusive && <span class="text-xs">À partir de</span>}

              <div>
                <div class="text-sm flex gap-1 items-start leading-[21px]">
                  R${" "}
                  <span class="text-2xl font-medium text-accent-content leading-[1.2]">
                    {offerPriceExclusive
                      ? formatPriceNew(offerPriceExclusive ?? 0)
                      : formatPriceNew(bestOffer ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          )
          : <div>Indisponível</div>}
      </div>
      <div class="p-4 bg-[#e9ecef] rounded-lg">
        <p class="text-sm">
          Informe seu CEP para ver se o produto está disponível na sua região.
        </p>
        <button
          onClick={() => (displayCepDrawer.value = true)}
          class="bg-primary w-full text-sm mt-2 text-white h-8 rounded-md hover:bg-accent duration-300"
        >
          Informar CEP
        </button>
      </div>
    </div>
  );
}

export default ProductBuyBoxNoCep;
