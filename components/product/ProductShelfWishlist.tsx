import type { Product } from "../../commerce/types.ts";
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
import WishlistSection from "../../islands/WishlistSection.tsx";

export interface Props {
  products: Product[] | null;
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
  };
}

function ProductShelf({ products, title, description, layout, seeAll }: Props) {
  const id = useId();
  const platform = usePlatform();

  if (!products || products.length === 0) {
    return <WishlistSection />;
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
    <div className="w-full max-w-[1366px] px-4 pt-8 flex flex-col gap-6 lg:pt-10 lg:px-10 lg:mx-auto">
      <div className="flex w-full justify-between items-center">
        <Header
          title={title || ""}
          description={description || ""}
          fontSize={layout?.headerfontSize || "Small"}
          alignment={layout?.headerAlignment || "left"}
        />
        {seeAll && (
          <div>
            <a
              className="text-primary hover:underline text-nowrap"
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
        className={clx(
          "relative border-b border-gray-200 pb-7",
          layout?.showArrows && "",
          "px-0",
        )}
      >
        <Slider className="carousel carousel-center w-full">
          {products?.map((product, index) => (
            <Slider.Item
              index={index}
              className={clx(
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
              />
            </Slider.Item>
          ))}
        </Slider>

        {layout?.showArrows && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <Slider.PrevButton className="disabled:invisible border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
                <Icon
                  size={24}
                  id="ChevronLeft"
                  strokeWidth={3}
                  className="w-5"
                />
              </Slider.PrevButton>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Slider.NextButton className="disabled:invisible border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
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
              items: products.map((product, index) =>
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
