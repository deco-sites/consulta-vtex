import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Icon from "../../components/ui/Icon.tsx";
import { AdKevel } from "../../commerce/types.ts";

export interface Props {
  /** @title Integration */
  banners: AdKevel | null;
}

function BannerSliderKevel(props: Props) {
  const id = useId();
  const { banners } = props;
  const items = banners?.contents;

  return (
    <div class="relative mx-auto max-w-[1366px] px-4 lg:px-10  mt-5 lg:mt-6">
      <div id={id} class="">
        <Slider class="carousel carousel-center w-full col-span-full row-span-full bannerHome">
          {items?.map(({ body }, index) => (
            <Slider.Item index={index} class="carousel-item w-full">
              {
                /* <a
                href={banners?.clickUrl}
                class="flex flex-col items-center justify-center gap-2 w-full"
                target="_blank"
              >
                <img
                  src={data.imageUrl}
                  alt={data.title}
                  width={data.width}
                  height={data.height}
                  loading="eager"
                  class="w-full"
                />
              </a> */
              }
              <div
                class="w-full"
                dangerouslySetInnerHTML={{ __html: body }}
              >
              </div>
            </Slider.Item>
          ))}
        </Slider>
        {(items?.length ?? 0) > 1 && (
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
      </div>
    </div>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default BannerSliderKevel;
