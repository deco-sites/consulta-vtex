import type { ProductDetailsPage } from "../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import { SendEventOnView } from "../../components/Analytics.tsx";
import ProductCard from "../../components/product/ProductCard.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Header from "../../components/ui/SectionHeader.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";

export interface Props {
  pageProduct: ProductDetailsPage | null;
  description?: string;

  showDiscount?: boolean;
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5 | 6;
    };
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large" | "Small";
    showArrows?: boolean;
    loading?: "lazy" | "eager";
  };
}

function ProductShelfRecommendation({
  pageProduct,
  description,
  layout,
  showDiscount = false,
}: Props) {
  const id = useId();
  const platform = usePlatform();

  const productsRecomendations = pageProduct?.productsRecomendations;

  if (
    !productsRecomendations?.products ||
    productsRecomendations?.products.length === 0
  ) {
    return null;
  }
  const slideDesktop = {
    1: "lg:w-full",
    2: "lg:w-1/2",
    3: "lg:w-1/3",
    4: "lg:w-1/4",
    5: "lg:w-1/5",
    6: "lg:w-1/6",
  };

  const slideMobile = {
    1: "w-full",
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
    5: "w-1/5",
  };

  const { head } = productsRecomendations;

  return (
    <div class="w-full max-w-[1366px] px-4 pt-8 flex flex-col gap-6 lg:pt-10 lg:px-10 lg:mx-auto">
      <div class="flex w-full justify-between items-center">
        <Header
          title={`Outros produtos na categoria ${head.title}`}
          description={description || ""}
          fontSize={layout?.headerfontSize || "Small"}
          alignment={layout?.headerAlignment || "left"}
          link={head.href || " "}
        />
        {head.href && (
          <div>
            <a
              class="text-primary hover:underline text-nowrap"
              aria-label="link ver tudo"
              href={head.href}
            >
              Ver tudo
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
          {productsRecomendations?.products?.map((product, index) => (
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
                itemListName={`Outros produtos na categoria ${head.title}`}
                platform={platform}
                index={index}
                loading={"lazy"}
                showDiscount={showDiscount}
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
              item_list_name: `Outros produtos na categoria ${head.title}`,
              items: productsRecomendations?.products?.map((product, index) =>
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

export default ProductShelfRecommendation;
