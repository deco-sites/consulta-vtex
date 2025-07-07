import { PageInfo, Product } from "apps/commerce/types.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import { Format } from "../../components/search/SearchResult.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";

export interface Columns {
  mobile?: 1 | 2;
  desktop?: 2 | 3 | 4 | 5;
}
export interface Props {
  products: Product[] | null;
  pageInfo: PageInfo;
  offset: number;
  layout?: {
    columns?: Columns;
    format?: Format;
  };
  url: URL;
}
const MOBILE_COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
};
const DESKTOP_COLUMNS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};
function ProductGallery({ products, pageInfo, layout, offset, url }: Props) {
  const platform = usePlatform();
  const mobile = MOBILE_COLUMNS[layout?.columns?.mobile ?? 1];
  const desktop = DESKTOP_COLUMNS[layout?.columns?.desktop ?? 3];
  const nextPage = pageInfo.nextPage
    ? new URL(pageInfo.nextPage, url.href)
    : null;
  const partialUrl = nextPage ? new URL(nextPage.href) : null;
  if (pageInfo.nextPage && nextPage) {
    partialUrl?.searchParams.set("partial", "true");
  }
  return (
    <div
      class={`grid ${mobile} gap-2 items-center ${desktop} lg:gap-0 pt-4 lg:border-l lg:border-neutral lg:pl-5`}
    >
      {products?.map((product, index) => (
        <div class="border-b border-neutral max-lg:px-2 py-4 lg:py-2 h-full">
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={index}
            platform={platform}
            classAditional="lg:h-full"
            isTagH2={true}
            isCategory={true}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
export default ProductGallery;
