import type { Product } from "../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import type { Platform } from "../../apps/site.ts";
import { SendEventOnClick } from "../../components/Analytics.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice, formatPriceNew } from "../../sdk/format.ts";
import { useOffer } from "../../sdk/useOffer.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  platform?: Platform;
  classAditional?: string;
}

const WIDTH = 40;
const HEIGHT = 40;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  classAditional,
}: Props) {
  const {
    productID,
    name,
    image: images,
    offers,
    additionalProperty,
    buyBox,
  } = product;
  const id = `product-card-${productID}`;
  const [front] = images ?? [];
  const { listPrice, price } = useOffer(offers);
  const aspectRatio = `${WIDTH} / ${HEIGHT}`;
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const linkProduct = additionalProperty?.find(
    (property) => property.name === "Spot" && property.value,
  );

  const quantity = additionalProperty?.find(
    (property) => property.name === "Quantidade na embalagem" && property.value,
  );

  let quantityValue;
  if (quantity) {
    quantityValue = quantity.value?.split(" ")[0];
    quantityValue = Number(quantityValue);
  }

  return (
    <div id={id} data-deco="view-product" class={`text-info ${classAditional}`}>
      {/* Add click event to dataLayer */}
      <SendEventOnClick
        id={id}
        event={{
          name: "select_item" as const,
          params: {
            item_list_name: itemListName,
            items: [
              mapProductToAnalyticsItem({
                product,
                price,
                listPrice,
                index,
              }),
            ],
          },
        }}
      />

      <div class="hover:bg-gray-100 border-b border-neutral p-2">
        {/* Product Images */}
        <a
          href={linkProduct?.value?.replace(
            "https://consultaremedios.com.br",
            "",
          )}
          aria-label="view product"
          class={clx(
            "pr-2 sm:pr-0 flex justify-between w-full gap-10 items-center",
          )}
        >
          <div class="flex gap-8 items-center">
            <Image
              src={front.url!}
              alt={front.alternateName}
              width={WIDTH}
              height={HEIGHT}
              style={{ aspectRatio: aspectRatio }}
              class={clx("min-w-[30px] max-w-[30px] max-h-[30px]")}
              sizes="(max-width: 640px) 50vw, 20vw"
              preload={preload}
              loading={preload ? "eager" : "lazy"}
              decoding="async"
            />
            <h2 class="text-sm max-w-[100%] text-wrap lg:text-base font-medium hover:underline">
              {name}
            </h2>
          </div>

          <div>
            {buyBox && buyBox?.quantityOffers && buyBox?.quantityOffers > 0
              ? (
                <div>
                  <div class="flex pt-2 flex-col items-end">
                    {buyBox?.minimumPrice !== 0.01 && (
                      <p class="text-sm text-secondary whitespace-nowrap">
                        a partir de:
                      </p>
                    )}
                    <div className="flex">
                      {buyBox?.minimumPrice !== 0.01 && (
                        <div class="text-xs flex gap-1 items-start leading-[21px]">
                          R${" "}
                          <span class="text-lg font-medium text-info leading-[1.2]">
                            {formatPriceNew(buyBox?.minimumPrice ?? 0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {buyBox?.minimumPrice &&
                      buyBox?.maximumPrice &&
                      buyBox?.maximumPrice > buyBox?.minimumPrice &&
                      buyBox?.maximumPrice !== 0.1 && (
                      <>
                        <span class="line-through text-sm font-normal leading-[1.5] text-secondary">
                          {formatPrice(
                            buyBox?.maximumPrice,
                            offers?.priceCurrency,
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div class="flex">
                    {buyBox?.minimumPrice &&
                      buyBox?.maximumPrice &&
                      buyBox?.maximumPrice > buyBox?.maximumPrice && (
                      <>
                        <span class="text-success mr-2 text-sm text-nowrap">
                          Economize {formatPrice(
                            (buyBox?.minimumPrice! - buyBox?.maximumPrice) * -1,
                            offers?.priceCurrency,
                          )}
                        </span>
                        <span class="text-white rounded bg-success font-semibold mr-2 text-xs text-nowrap px-1 py-1 ">
                          {Math.round(
                            ((buyBox?.maximumPrice - buyBox?.minimumPrice) /
                              buyBox?.maximumPrice) *
                              100,
                          )} % OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )
              : (
                <div>
                  <div class="flex pt-2 flex-col items-end">
                    <p class="text-content text-sm font-bold">Indisponível</p>
                  </div>
                </div>
              )}
          </div>
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
