import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface Props {
  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
    width?: number;
    height?: number;
    widthMobile?: number;
    heightMobile?: number;
  };
  alt?: string;
}

function Banner({ alt, images }: Props) {
  return (
    <div class="relative mx-auto max-w-[1366px] px-4 lg:px-10  mt-5 lg:mt-6">
      <Picture>
        <Source
          media="(max-width: 640px)"
          src={images.mobile}
          width={images?.widthMobile ?? 600}
          height={images?.heightMobile ?? 200}
        />
        <Source
          media="(min-width: 640px)"
          src={images.desktop}
          width={images?.width ?? 800}
          height={images?.height ?? 250}
        />
        <img
          src={images.desktop}
          alt={alt ?? "Banner Image"}
          class="w-full object-fill rounded-lg lg:rounded-3xl"
          width={images?.width ?? 1300}
          height={images?.height ?? 450}
          preload={"true"}
          loading={"eager"}
        />
      </Picture>
    </div>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default Banner;
