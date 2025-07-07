import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import { SendEventOnView } from "../Analytics.tsx";
import ProductCard from "./ProductCard.tsx";
import Icon from "../ui/Icon.tsx";
import Header from "../ui/SectionHeader.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { HomePage } from "../../commerce/pages/home.ts";
export interface Props {
  products: HomePage | null;
  seeAll?: {
    href?: string;
    text?: string;
  };
  title?: string;
  description?: string;
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large" | "Small";
    showArrows?: boolean;
    loading?: "lazy" | "eager";
  };
  typeCarrousel:
    | "anticoagulante"
    | "colageno"
    | "descongestionanteNasal"
    | "diabetes"
    | "disfuncaoEretil"
    | "leiteInfantil"
    | "medicamentosAltoCusto"
    | "pararDeFumar";
}

function ProductShelf({
  products,
  title,
  description,
  layout,
  seeAll,
  typeCarrousel,
}: Props) {
  const id = useId();
  const platform = usePlatform();

  if (!products) {
    return null;
  }

  const productsRender = products[typeCarrousel] || [];

  if (!products || productsRender.length === 0) {
    return null;
  }
  const slideDesktop = {
    1: "lg:w-full",
    2: "lg:w-1/2",
    3: "lg:w-1/3",
    4: "lg:w-1/4",
    5: "lg:w-1/5",
  };

  const slideMobile = {
    1: "w-full",
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
    5: "w-1/5",
  };

  return (
    <div class="w-full max-w-[1366px] px-4 pt-8 flex flex-col gap-6 lg:pt-10 lg:px-10 lg:mx-auto">
      <div class="flex w-full justify-between items-center">
        <Header
          title={title || ""}
          description={description || ""}
          fontSize={layout?.headerfontSize || "Small"}
          alignment={layout?.headerAlignment || "left"}
          link={seeAll?.href}
        />
        {seeAll && (
          <div>
            <a
              class="text-primary hover:underline text-nowrap"
              aria-label="link ver tudo"
              href={seeAll.href}
            >
              {seeAll.text}
            </a>
          </div>
        )}
      </div>

      <div
        id={id}
        class={clx(
          "relative border-b border-gray-200 pb-7",
          layout?.showArrows && "",
          "px-0",
        )}
      >
        <Slider class="carousel carousel-center w-full">
          {productsRender?.map((product, index) => (
            <Slider.Item
              index={index}
              class={clx(
                "carousel-item",
                slideDesktop[layout?.numberOfSliders?.desktop ?? 3],
                slideMobile[layout?.numberOfSliders?.mobile ?? 1],
              )}
            >
              <ProductCard
                product={product}
                itemListName={title}
                platform={platform}
                index={index}
                loading={layout?.loading || "eager"}
              />
            </Slider.Item>
          ))}
        </Slider>

        {layout?.showArrows && (
          <>
            <div class="absolute left-0 top-1/2 -translate-y-1/2">
              <Slider.PrevButton class="disabled:invisible border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
                <Icon size={24} id="ChevronLeft" strokeWidth={3} class="w-5" />
              </Slider.PrevButton>
            </div>
            <div class="absolute right-0 top-1/2 -translate-y-1/2">
              <Slider.NextButton class="disabled:invisible border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
                <Icon size={24} id="ChevronRight" strokeWidth={3} />
              </Slider.NextButton>
            </div>
          </>
        )}
        <Slider.JS rootId={id} />
        <SendEventOnView
          id={id}
          event={{
            name: "view_item_list",
            params: {
              item_list_name: title,
              items: productsRender.map((product, index) =>
                mapProductToAnalyticsItem({
                  index,
                  product,
                  ...useOffer(product.offers),
                })
              ),
            },
          }}
        />
      </div>
    </div>
  );
}

export default ProductShelf;
