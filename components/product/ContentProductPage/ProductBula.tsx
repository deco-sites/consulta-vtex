// Arquivo: components/ProductBula.tsx
import { ProductVariation } from "../../../commerce/ContentTypes.ts";

interface ProductBulaProps {
  contentPage: ProductVariation;
}
/**
 * Componente que renderiza a bula do produto em formato de acordeão
 * Inclui títulos, conteúdo HTML dinâmico e link para bula completa
 */
export function ProductBula({ contentPage }: ProductBulaProps) {
  // Verifica se é um medicamento (produto do tipo 1)
  const isProductMedicine = contentPage.product?.productType === 1;

  // Se não for medicamento, não renderiza o componente
  if (!isProductMedicine) return null;

  // Verifica a existência de atributos do produto
  const productAttributes = contentPage.product?.productAttribute;

  // Acesso às informações da substância
  const substance = contentPage.substance;

  // console.log(substance);

  // Filtrar apenas o atributo "Ação da Substância" dos atributos da substância
  const substanceActionAttribute = substance?.substanceAttribute
    ?.filter(
      (attr) =>
        attr.attribute?.title === "Ação da Substância" ||
        attr.attributeId === 16,
    )
    .map((sa) => ({
      id: sa.id,
      productId: null,
      attributeId: sa.attributeId,
      attribute: sa.attribute,
      attributeValueId: sa.attributeValueId,
      attributeValue: null,
      value: sa.value,
    })) || [];

  // Combine product attributes and the "Ação da Substância" attribute
  const combinedAttributes = [
    ...(productAttributes || []),
    ...substanceActionAttribute,
  ];

  // Filtrar apenas atributos visíveis e ordenar pelo campo sort
  const visibleAttributes = combinedAttributes
    .filter((attr) => !attr.attribute?.hidden && attr.value)
    .sort((a, b) => {
      // Ordenar pelo valor de sort
      return (a.attribute?.sort || 0) - (b.attribute?.sort || 0);
    });

  const hasVisibleAttributes = !!visibleAttributes &&
    visibleAttributes.length > 0;

  // Não renderiza nada se não houver atributos visíveis
  if (!hasVisibleAttributes) return null;

  return (
    <div className="mb-8">
      <h2 className="self-stretch justify-center text-[#212529] text-[28px] font-medium  leading-[33.60px] p-4 border-b border-[#dee2e6]">
        Bula do {contentPage.product?.title || contentPage.title}
      </h2>

      <div>
        {visibleAttributes.map((attr, index) => {
          // Verificar se é HTML
          const isHtml = attr.value && attr.value.includes("<") &&
            attr.value.includes(">");

          return (
            <details key={index} className="group" open={index < 2}>
              <summary className="flex justify-between items-center p-4 cursor-pointer list-none border-b border-[#dee2e6] max-lg:px-2">
                <h3 className="self-stretch justify-center text-[#212529] text-2xl font-medium  leading-[28.80px] lg:mr-8 mr-4">
                  {attr.attribute?.customerTitle?.replace(
                    "{name}",
                    contentPage.product?.title || "",
                  ) || attr.attribute?.title}
                </h3>
                <span className="text-[#212529] transition-transform duration-200 group-open:rotate-180 group-open:text-[#009999]">
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="Union"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.05715 6.30666C2.11521 6.24846 2.18418 6.20228 2.26011 6.17077C2.33604 6.13926 2.41744 6.12305 2.49965 6.12305C2.58186 6.12305 2.66326 6.13926 2.73919 6.17077C2.81513 6.20228 2.8841 6.24846 2.94215 6.30666L9.99965 13.3654L17.0572 6.30666C17.1153 6.24855 17.1842 6.20246 17.2602 6.17101C17.3361 6.13956 17.4175 6.12337 17.4997 6.12337C17.5818 6.12337 17.6632 6.13956 17.7391 6.17101C17.8151 6.20246 17.884 6.24855 17.9422 6.30666C18.0003 6.36477 18.0464 6.43376 18.0778 6.50968C18.1093 6.58561 18.1254 6.66698 18.1254 6.74916C18.1254 6.83134 18.1093 6.91272 18.0778 6.98864C18.0464 7.06457 18.0003 7.13355 17.9422 7.19166L10.4422 14.6917C10.3841 14.7499 10.3151 14.796 10.2392 14.8276C10.1633 14.8591 10.0819 14.8753 9.99965 14.8753C9.91744 14.8753 9.83604 14.8591 9.76011 14.8276C9.68418 14.796 9.61521 14.7499 9.55715 14.6917L2.05715 7.19166C1.99895 7.13361 1.95277 7.06464 1.92126 6.98871C1.88975 6.91277 1.87354 6.83137 1.87354 6.74916C1.87354 6.66695 1.88975 6.58555 1.92126 6.50962C1.95277 6.43369 1.99895 6.36472 2.05715 6.30666V6.30666Z"
                    />
                  </svg>
                </span>
              </summary>

              <div className="p-4 border-b border-[#dee2e6] max-lg:px-2">
                {isHtml
                  ? (
                    <div
                      className="prose max-w-none text-[#212529] text-lg font-normal leading-[27px] break-words hyphens-auto"
                      dangerouslySetInnerHTML={{ __html: attr.value }}
                    />
                  )
                  : (
                    <p className="text-[#212529] text-lg font-normal  leading-[27px]">
                      {attr.value}
                    </p>
                  )}
              </div>
            </details>
          );
        })}

        {/* Links para bulas no final da seção */}
        {contentPage.product?.slug && (
          <div className="mt-6">
            <div className="flex  flex-col md:flex-row gap-4 px-4 pt-2 pb-4">
              <a
                href={`/${contentPage.product.slug}/bula`}
                rel="noopener noreferrer"
                className="text-white text-lg p-3 hover:underline duration-300 rounded font-normal bg-primary hover:bg-accent"
              >
                Bula do {contentPage.product.title}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductBula;
