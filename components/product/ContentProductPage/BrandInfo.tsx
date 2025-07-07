// Arquivo: components/BrandInfo.tsx
import { ProductVariation } from "../../../commerce/ContentTypes.ts";

interface BrandInfoProps {
  contentPage: ProductVariation;
}

/**
 * Componente que exibe informações sobre a marca e botão para ver todos os produtos
 */
export function BrandInfo({ contentPage }: BrandInfoProps) {
  // Verifica se existe uma descrição da marca
  if (!contentPage?.product?.brand?.productDescription) return null;

  return (
    <div className="mb-8 border-t border-[#dee2e6] lg:px-4">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: contentPage?.product?.brand?.productDescription,
        }}
      />
      {contentPage?.product?.brand?.slug && (
        <div className="mt-4 flex justify-start">
          <a
            href={`/marca/${contentPage?.product?.brand?.slug}`}
            className="bg-[#099] text-white px-4 py-2 rounded-md font-medium inline-block 
                   hover:bg-teal-600 hover:border-teal-600
                   focus:ring-4 focus:ring-teal-300/50
                   active:bg-teal-700 active:border-teal-700 active:shadow-inner
                   disabled:opacity-65 disabled:bg-teal-500/65 disabled:text-white/65 disabled:border-teal-500/65
                   transition-colors duration-150 ease-in-out"
          >
            Todos os produtos de {contentPage?.product?.brand?.brandName}
          </a>
        </div>
      )}
    </div>
  );
}

export default BrandInfo;
