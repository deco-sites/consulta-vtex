import { ProductDetailsPage } from "../../commerce/types.ts";
import ProductMainVariantComparison from "../../components/product/ContentProductMainPage/ProductMainVariantComparison.tsx";

export interface ContentProductMainProps {
  contentPage: ProductDetailsPage | null;
}

function ContentProductMainPage({ contentPage }: ContentProductMainProps) {
  if (!contentPage || !contentPage?.productMainContent) {
    return null;
  }

  return (
    <div className="w-full max-w-[1366px] lg:px-10 mx-auto">
      {/* Componente de comparação de variações */}
      <ProductMainVariantComparison product={contentPage.productMainContent} />
    </div>
  );
}

export function LoadingFallback() {
  return (
    <div
      style={{ height: "600px" }}
      class="flex justify-center flex-row px-4 lg:px-10 gap-6 py-8 lg:py-10 mx-auto max-w-[1366px]"
    >
      <div class="w-full max-h-[500px] max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
      <div class="w-full max-h-[500px] max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
      <div class="w-full max-h-[500px] max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}

export default ContentProductMainPage;
