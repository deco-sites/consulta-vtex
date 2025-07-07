import { formatPriceNew } from "../../sdk/format.ts";

interface Props {
  slugProduct: string | undefined;
  maximumPrice: number | undefined;
  minimumPrice: number | undefined;
}

function LeaftletBoxOffer({ slugProduct, maximumPrice, minimumPrice }: Props) {
  return (
    <div
      id="box-sideview"
      class="p-2 lg:p-4 max-lg:mx-1 border-[2px] border-cecondary-content h-fit rounded-lg mt-4 lg:sticky top-20 bg-white z-[2] mb-3"
    >
      <div class="flex gap-2 items-center">
        <svg width="32" height="32" stroke-width="0.01" class="cursor-pointer">
          <use href="/sprites.svg?__frsh_c=3170f103624ee677bacf8350aeb65f62debf889e#BestOffer">
          </use>
        </svg>
        <span class="text-sm font-bold text-accent-content">Ofertas</span>
        <svg width="14" height="14" stroke-width="0.01" class="cursor-pointer">
          <use href="/sprites.svg?__frsh_c=3170f103624ee677bacf8350aeb65f62debf889e#Info">
          </use>
        </svg>
      </div>
      <div class="px-2 py-4">
        <div>
          <span class="text-xs">À partir de</span>
          <div>
            {minimumPrice != maximumPrice
              ? (
                <div class="text-sm flex gap-1 items-end leading-[21px]">
                  <span class="text-lg">
                    R$ {formatPriceNew(minimumPrice ?? 0)}
                  </span>{" "}
                  <span class="leading-[25px]">até</span>{" "}
                  <span class="text-lg">
                    R$ {formatPriceNew(maximumPrice ?? 0)}
                  </span>
                </div>
              )
              : (
                <div class="text-sm flex gap-1 items-end leading-[21px]">
                  {minimumPrice == 0.01
                    ? <span>Indisponível</span>
                    : (
                      <span class="text-lg">
                        R$ {formatPriceNew(minimumPrice ?? 0)}
                      </span>
                    )}
                </div>
              )}
          </div>
        </div>
      </div>
      <div class="p-4 bg-[#e9ecef] rounded-lg mb-4">
        <p class="text-sm">Veja todas as ofertas desse produto</p>
        <a
          href={slugProduct}
          class="bg-primary w-full flex items-center justify-center text-sm mt-2 text-white h-8 rounded-md hover:bg-accent duration-300"
        >
          Ver ofertas
        </a>
      </div>
    </div>
  );
}

export default LeaftletBoxOffer;
