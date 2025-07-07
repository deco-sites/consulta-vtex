// Arquivo: components/ProductBula.tsx
import { ProductVariation } from "../../../commerce/ContentTypes.ts";

interface ProductDescriptionProps {
  contentPage: ProductVariation;
}

/**
 * Componente que exibe a descrição completa do produto em HTML
 */
export function ProductDescription({ contentPage }: ProductDescriptionProps) {
  if (!contentPage.product?.description) return null;

  return (
    <div className="mb-8 lg:px-4">
      <h2 class="font-inter text-[1.75rem] font-medium leading-[1.2] tracking-[-.03125rem] lg:text-[2rem] border-t border-gray-200 py-4">
        Sobre o {contentPage.product?.title || contentPage.title}
      </h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: contentPage.product.description,
        }}
      />
    </div>
  );
}

export default ProductDescription;
