// Arquivo: components/ProductMainDescription.tsx
import { Product } from "../../../commerce/ContentTypes.ts";

interface ProductMainDescriptionProps {
  contentPage: Product;
}

/**
 * Componente que exibe a descrição completa do produto principal em HTML
 */
export function ProductMainDescription({
  contentPage,
}: ProductMainDescriptionProps) {
  // Verificação direta da descrição no objeto Product
  if (!contentPage.description) return null;

  return (
    <div className="mb-8 lg:px-4">
      <h2 className="font-inter text-[1.75rem] font-medium leading-[1.2] tracking-[-.03125rem] lg:text-[2rem] border-t border-gray-200 py-4">
        Sobre o {contentPage.title}
      </h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: contentPage.description,
        }}
      />
    </div>
  );
}

export default ProductMainDescription;
