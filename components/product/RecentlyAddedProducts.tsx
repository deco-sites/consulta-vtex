import type { Product } from "../../commerce/types.ts";
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

export interface Props {
  products: Product[] | null;
  title?: string;
  description?: string;
}

function RecentlyAddedProducts({ products, title, description }: Props) {
  const platform = usePlatform();

  if (!products || products.length === 0) {
    return null;
  }
  console.log(products[0]);

  return (
    <div className="flex justify-center px-10 lg flex-col md:px-8 lg:px-10 gap-6 py-4 lg:py-10 mx-auto max-w-[1366px]">
      <div>
        <h2 className="text-[28px] font-medium text-[#212529] text-center">
          {title}
        </h2>
        <p className="text-[#6C757D] text-center">{description}</p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
        {products?.map((product) => {
          const slug = product?.additionalProperty?.find((attr) =>
            attr.name == "Spot"
          );
          if (slug) {
            const valueSlug = slug.value?.split("/");
            if (valueSlug && valueSlug.length >= 6) {
              slug.value = `/${valueSlug[3]}/p`;
            }
          }
          return (
            <li className="border border-[#6C757D]  py-2 px-4 rounded">
              <a className="flex gap-2" href={slug?.value}>
                {product.image && product?.image?.length > 0 && (
                  <img
                    className="max-w-[49px] h-auto"
                    src={product?.image[0]?.url}
                    alt={product.alternateName}
                  />
                )}
                <p className="line-clamp-2">
                  {product.isVariantOf?.name}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentlyAddedProducts;
