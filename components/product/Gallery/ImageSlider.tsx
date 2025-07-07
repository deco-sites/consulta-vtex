import { ProductDetailsPage } from "../../../commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../../components/ui/Icon.tsx";
import Slider from "../../../components/ui/Slider.tsx";
import { useId } from "../../../sdk/useId.ts";
import AddProductWishlist from "../../../islands/WishlistButton/wake.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;

  layout?: {
    width: number;
    height: number;
  };
}

const DEFAULT_IMAGE =
  "https://assets.decocache.com/consul-remedio/8c221a38-e1f1-4882-822e-50263f321e77/health_and_beauty.png";

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: {
      product: { image: images = [], productID, inProductGroupWithID },
    },
    layout,
  } = props;

  const { width, height } = layout || { width: 220, height: 220 };

  const aspectRatio = `${width} / ${height}`;

  return (
    <div
      id={id}
      class="grid grid-flow-row lg:grid-flow-col gap-2 lg:h-fit lg:sticky lg:top-5"
    >
      {/* Image Slider */}
      <div class="relative order-1 sm:order-2 cursor-pointer">
        <div class="absolute right-1 top-3">
          <AddProductWishlist
            productID={productID}
            productGroupID={inProductGroupWithID}
          />
        </div>
        <Slider class="carousel carousel-center gap-6 w-full lg:min-h-[440px]">
          {images?.map((img, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-full justify-center"
            >
              <Image
                class="w-full lg:w-full lg:h-fit lg:max-w-[80%]"
                sizes="(max-width: 640px) 100vw, 40vw"
                src={
                  img.alternateName == "Default Image Placeholder"
                    ? DEFAULT_IMAGE
                    : img.url!
                }
                alt={img.alternateName}
                width={width}
                height={height}
                // Preload LCP image for better web vitals
                preload={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Slider.Item>
          ))}
        </Slider>
        {images?.length! > 1 && (
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
      </div>

      {/* Dots */}
      <ul class="carousel carousel-center gap-1 p-1 lg:px-0 lg:flex-col order-2 lg:order-1">
        {images?.map((img, index) => (
          <li class="carousel-item min-w-12 min-h-12">
            <Slider.Dot index={index}>
              <Image
                style={{ aspectRatio }}
                class="group-disabled:border-info border border-neutral rounded p-1 min-w-12 min-h-12 max-h-12"
                width={40}
                height={40}
                src={
                  img.alternateName == "Default Image Placeholder"
                    ? DEFAULT_IMAGE
                    : img.url!
                }
                alt={img.alternateName}
                loading={"eager"}
              />
            </Slider.Dot>
          </li>
        ))}
      </ul>

      <Slider.JS rootId={id} />
    </div>
  );
}
