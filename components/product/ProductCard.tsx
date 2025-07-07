import type { Product } from "../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import type { Platform } from "../../apps/site.ts";
import { SendEventOnClick } from "../../components/Analytics.tsx";
import { clx } from "../../sdk/clx.ts";
import {
  formatarTextoParaHref,
  formatPrice,
  formatPriceNew,
} from "../../sdk/format.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import Icon from "../../components/ui/Icon.tsx";
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
  loading?: "lazy" | "eager";

  showDiscount?: boolean;
  isTagH2?: boolean;
  isCategory?: boolean;
}

const WIDTH = 150;
const HEIGHT = 150;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  classAditional,
  loading = "eager",
  showDiscount = true,
  isTagH2,
  isCategory,
}: Props) {
  const {
    productID,
    name,
    image: images,
    offers,
    additionalProperty,
    brand,
    buyBox,
    isVariantOf,
    sku,
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

  const principioAtivo = additionalProperty?.find(
    (property) => property.name === "Princípio ativo" && property.value,
  );

  // const factory = additionalProperty?.find(
  //   (property) => property.name === "Fabricante" && property.value,
  // );

  const brandProperty = additionalProperty?.find(
    (property) => property.name === "Marca" && property.value,
  );

  // const quantity = additionalProperty?.find(
  //   (property) => property.name === "Quantidade na embalagem" && property.value
  // );

  // const dose = additionalProperty?.find(
  //   (property) => property.name === "Dose" && property.value,
  // );

  // const quantityValue = quantity?.value
  //   ? Number(quantity.value.split(" ")[0])
  //   : undefined;

  return (
    <div
      id={id}
      data-deco="view-product"
      class={`card card-compact gap-2 lg:gap-0 flex-row lg:flex-col group w-full lg:border lg:border-transparent lg:hover:border-inherit lg:p-4 text-info  ${classAditional}`}
    >
      <input type="hidden" value={isVariantOf?.productGroupID}></input>
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

      <div class="">
        {/* Product Images */}
        <a
          href={linkProduct?.value?.replace(
            "https://consultaremedios.com.br",
            "",
          )}
          aria-label="view product"
          class={clx("pr-2 sm:pr-0")}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: aspectRatio }}
            class={clx(
              "min-w-[120px] max-w-[120px] sm:max-w-max sm:w-full h-auto",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={isCategory && (index ?? 0) < 3 ? "eager" : loading}
            decoding="async"
          />
        </a>
      </div>
      <div>
        <a
          href={linkProduct?.value?.replace(
            "https://consultaremedios.com.br",
            "",
          )}
          class="pt-3"
        >
          {isTagH2
            ? (
              <h2 class="text-sm lg:text-base font-medium line-clamp-3 leading-[1.5] min-h-[3lh] hover:underline">
                {name}
              </h2>
            )
            : (
              <h3 class="text-sm lg:text-base font-medium line-clamp-3 leading-[1.5] min-h-[3lh] hover:underline">
                {name}
              </h3>
            )}

          {buyBox &&
              buyBox?.quantityOffers &&
              buyBox?.quantityOffers > 0 &&
              (buyBox?.minimumPrice ?? 0) > 0.01
            ? (
              <div class="pt-2">
                <p class="text-sm text-secondary">A partir de:</p>
                <div class="flex  items-end flex-wrap">
                  <div className="flex">
                    <div class="text-sm flex gap-1 items-start leading-[21px]">
                      R${" "}
                      <span class="text-2xl font-medium text-info leading-[1.2]">
                        {formatPriceNew(buyBox?.minimumPrice ?? 0)}
                      </span>
                    </div>
                  </div>
                  {buyBox?.minimumPrice &&
                    buyBox?.maximumPrice &&
                    buyBox?.maximumPrice > buyBox?.minimumPrice && (
                    <>
                      <span class="line-through font-light leading-[1.5] ml-1 text-secondary">
                        {formatPrice(
                          buyBox?.maximumPrice,
                          offers?.priceCurrency,
                        )}
                      </span>
                    </>
                  )}
                </div>

                {showDiscount && (
                  <div class="flex flex-wrap mt-1 ">
                    {buyBox?.minimumPrice &&
                      buyBox?.maximumPrice &&
                      buyBox?.minimumPrice < buyBox?.maximumPrice && (
                      <>
                        <span class="text-success mr-2 text-sm text-nowrap flex items-end">
                          Economize {formatPrice(
                            (buyBox?.minimumPrice! - buyBox?.maximumPrice) * -1,
                            offers?.priceCurrency,
                          )}
                        </span>
                        <span class="text-white rounded bg-success font-semibold mr-2 text-xs text-nowrap px-1 py-1  ">
                          {Math.round(
                            ((buyBox?.maximumPrice - buyBox?.minimumPrice) /
                              buyBox?.maximumPrice) *
                              100,
                          )} % OFF
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
            : (
              <div class="py-2">
                <p class="text-content font-bold">Indisponível</p>
              </div>
            )}
        </a>

        <div class="mt-4 flex flex-col gap-2">
          {brand && (
            <a href={brand.url} class="flex gap-2 items-center hover:underline">
              <Icon class="min-w-5" id="Factory" size={21} strokeWidth={1} />

              <span class="text-xs lg:text-sm line-clamp-1 text-info">
                {brand?.name}
              </span>
            </a>
          )}
          {brandProperty && (
            <a
              arial-label="link brand"
              href={`/marca/${
                formatarTextoParaHref(
                  brandProperty?.value ?? "",
                )
              }`}
              class="flex gap-2 hover:underline items-center"
            >
              <Icon
                class="min-w-5"
                id="DiamondSpot"
                size={21}
                strokeWidth={1}
              />
              <span class="text-xs lg:text-sm line-clamp-1 text-info">
                {brandProperty?.value}
              </span>
            </a>
          )}

          {principioAtivo && (
            <a
              arial-label="link brand"
              class="flex gap-2 hover:underline items-center"
              href={`/${formatarTextoParaHref(principioAtivo?.value ?? "")}/pa`}
            >
              <Icon class="min-w-5" id="Substance" size={21} strokeWidth={1} />
              <span class="text-xs lg:text-sm line-clamp-1 text-info">
                {principioAtivo.value}
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
