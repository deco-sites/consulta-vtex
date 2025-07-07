import Image from "apps/website/components/Image.tsx";
import type { CategoryThumb } from "../../commerce/attributesTypes.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Icon from "../../components/ui/Icon.tsx";

export interface Props {
  items?: CategoryThumb[];
}

function CategoryList(props: Props) {
  const id = useId();
  const { items } = props;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div class="max-w-[1400px] py-6 flex flex-col gap-8  lg:gap-0 text-info lg:py-10 ">
      <div id={id} class="max-w-full flex flex-col relative">
        <Slider class="carousel carousel-start gap-4 lg:gap-0 row-start-2 row-end-5 ">
          {items?.map(({ categoryName, slug, image }, index) => (
            <Slider.Item
              index={index}
              class="flex flex-col gap-4 carousel-item "
            >
              <a
                href={`/${slug}/c`}
                class="flex flex-col items-center justify-center  gap-2 w-[120px] lg:w-[152px] lg:px-4"
              >
                <div class="">
                  <Image
                    src={image}
                    alt={categoryName}
                    width={72}
                    height={72}
                    loading="eager"
                  />
                </div>
                <span class="font-medium text-sm text-center">
                  {categoryName}
                </span>
              </a>
            </Slider.Item>
          ))}
        </Slider>
        <div class="absolute left-0 top-1/2 -translate-y-1/2">
          <Slider.PrevButton class="disabled:hidden border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
            <Icon size={24} id="ChevronLeft" strokeWidth={3} class="w-5" />
          </Slider.PrevButton>
        </div>
        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <Slider.NextButton class="disabled:hidden border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
            <Icon size={24} id="ChevronRight" strokeWidth={3} />
          </Slider.NextButton>
        </div>
        <Slider.JS rootId={id} />
      </div>
    </div>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default CategoryList;
