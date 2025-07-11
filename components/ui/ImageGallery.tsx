import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/**
 * @titleBy title
 */
export interface Props {
  /** @description Title */
  title: string;

  /** @description Description */
  description: string;

  /** @description Image one */
  imageOne: ImageWidget;

  /** @description Image two */
  imageTwo: ImageWidget;

  /** @description Image Three */
  imageThree: ImageWidget;

  /** @description Image Four */
  imageFour: ImageWidget;

  /** @description Image's alt text */
  alt: string;
}

export default function ImageGallery({
  title,
  description,
  imageOne,
  imageTwo,
  imageThree,
  imageFour,
  alt,
}: Props) {
  return (
    <section class="px-4 max-w-[1360px] lg:m-auto">
      <h1 class="text-info text-4xl text-center mt-10 mb-4 lg:text-6xl lg:mb-6">
        {title}
      </h1>
      <p class="text-center text-info text-2xl leading-7">{description}</p>
      <div class="grid grid-cols-2 gap-4 mt-11 lg:flex lg:gap-8 lg:mt-20">
        <Image
          class="min-w-full object-cover max-w-[156px] max-h-[156px] "
          src={imageOne}
          alt={alt}
          width={156}
          height={156}
        />
        <Image
          class="min-w-full object-cover max-w-[156px] max-h-[156px] "
          src={imageTwo}
          alt={alt}
          width={156}
          height={156}
        />
        <Image
          class="min-w-full object-cover max-w-[156px] max-h-[156px] "
          src={imageThree}
          alt={alt}
          width={156}
          height={156}
        />
        <Image
          class="min-w-full object-cover max-w-[156px] max-h-[156px] "
          src={imageFour}
          alt={alt}
          width={156}
          height={156}
        />
      </div>
    </section>
  );
}
