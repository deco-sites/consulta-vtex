// Arquivo: components/product/ContentProductPage/ProductSpecifications.tsx
import { ProductVariation } from "../../../commerce/ContentTypes.ts";
import { ProductPriceSpecificationsIsland } from "../../../islands/ProductPriceSpecificationsIsland.tsx";
import type { Product as ProductMain } from "../../../commerce/types.ts";
import { formatarTextoParaHref } from "../../../sdk/format.ts";
export interface ProductSpecificationsProps {
  contentPage: ProductVariation;
  product?: ProductMain;
  genericProducts?:
    | Array<{
      mainVariant: boolean;
      productName: string;
      productId: string;
      alias: string;
      id: string;
      productVariantId: string;
      parentId: string | null;
      sku: string;
      variantName: string | null;
      spotInformation: string | null;
      available: boolean;
    }>
    | null;
}

/**
 * Componente que exibe as especificações técnicas do produto em formato de tabela
 * Cada linha só é renderizada se tiver dados válidos
 */
export function ProductSpecifications({
  contentPage,
  product,
  genericProducts,
}: ProductSpecificationsProps) {
  // Verificações para decidir quais linhas renderizar
  const hasFabricante = () =>
    contentPage.product?.factory &&
    (contentPage.product.factory.commercialName ||
      contentPage.product.factory.factoryName);

  const hasTipoMedicamento = () =>
    contentPage.classification?.classificationName;

  const hasNecessitaReceita = () =>
    contentPage.prescriptionType?.prescriptionTypeName;

  const hasSubstance = () => contentPage.substance?.substanceName;

  const hasCategoryMedicine = () => {
    const mainCategory = contentPage.product?.productCategory?.find(
      (cat) => cat.mainCategory,
    );
    return {
      mainCategory: mainCategory?.category?.categoryName,
      path: mainCategory?.category?.path,
    };
  };

  const category = hasCategoryMedicine();
  const isCategoryMedicine = category.path?.includes("Medicamentos");

  const hasClasseTerapeutica = () =>
    contentPage.therapeuticClass?.therapeuticClassName;

  const hasEspecialidades = () =>
    contentPage.product?.medicalSpecialty &&
    contentPage.product.medicalSpecialty.length > 0;

  const hasRegistroMinisterio = () => contentPage.registry;

  const hasCodigoBarras = () => contentPage.ean;

  const hasTemperaturaArmazenamento = () =>
    contentPage.storageTemperature?.storageTemperatureName;

  const hasProdutoRefrigerado = () => true; // Sempre mostra, baseado na temperatura

  const hasDoencasRelacionadas = () =>
    contentPage.substance?.disease && contentPage.substance.disease.length > 0;

  const hasBulaPaciente = () => contentPage.product?.leaflet;

  const hasBulaProfissional = () => contentPage.product?.leafletPro;

  const hasModoUso = () => contentPage.administrationMethod;

  const hasCanBeSplitted = () => contentPage.canBeSplitted !== undefined;

  const brandProperty = product?.additionalProperty?.find(
    (property) => property.name === "Marca" && property.value,
  );

  // Se não tiver nenhuma especificação, não renderiza o componente
  if (
    !hasFabricante() &&
    !hasTipoMedicamento() &&
    !hasNecessitaReceita() &&
    !hasSubstance() &&
    !hasCategoryMedicine() &&
    !hasClasseTerapeutica() &&
    !hasEspecialidades() &&
    !hasRegistroMinisterio() &&
    !hasCodigoBarras() &&
    !hasTemperaturaArmazenamento() &&
    !hasDoencasRelacionadas() &&
    !hasBulaPaciente() &&
    !hasBulaProfissional() &&
    !hasModoUso() &&
    !hasCanBeSplitted()
  ) {
    return null;
  }

  // Função para obter a alternância de cores das linhas
  const getRowClass = (index: number) => {
    return index % 2 === 0 ? "bg-[#e9ecef]" : "bg-white";
  };

  return (
    <div class="mb-8">
      <h2 class="font-inter text-[1.75rem] font-medium leading-[1.2] tracking-[-.03125rem] lg:text-[2rem] border-t border-gray-200 py-4 lg:px-4">
        Especificações sobre o {contentPage.product?.title || contentPage.title}
      </h2>
      <h3 class="text-2xl font-medium leading-[1.2] xl:text-[1.75rem] my-4 text-[#212529] lg:px-4">
        Caracteristicas Principais
      </h3>

      <div class="overflow-x-auto lg:px-2">
        <table class="min-w-full bg-white border-collapse border border-[#dee2e6] rounded text-sm">
          <tbody class="table-specification">
            {/* Fabricante */}
            {hasFabricante() && (
              <tr class={getRowClass(0)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Fabricante
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.product?.factory?.slug
                    ? (
                      <a
                        href={`/fabricante/${contentPage.product.factory.slug}`}
                        class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                      >
                        {contentPage.product.factory.commercialName ||
                          contentPage.product.factory.factoryName}
                      </a>
                    )
                    : (
                      contentPage.product?.factory?.commercialName ||
                      contentPage.product?.factory?.factoryName
                    )}
                </td>
              </tr>
            )}
            {brandProperty && (
              <tr>
                <td class="py-3 px-4 font-medium text-content w-1/2">Marca</td>
                <td class="py-3 px-4 text-gray-800">
                  <a
                    class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                    arial-label="link brand"
                    href={`/marca/${
                      formatarTextoParaHref(
                        brandProperty?.value ?? "",
                      )
                    }`}
                  >
                    {brandProperty.value}
                  </a>
                </td>
              </tr>
            )}

            {/* Tipo do Medicamento */}
            {hasTipoMedicamento() && (
              <tr class={getRowClass(1)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Tipo do Medicamento
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.classification?.classificationName}
                </td>
              </tr>
            )}

            {/* Necessita de Receita */}
            {hasNecessitaReceita() && (
              <tr class={getRowClass(2)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Necessita de Receita
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.prescriptionType?.prescriptionTypeName}
                </td>
              </tr>
            )}

            {/* Princípio Ativo */}
            {hasSubstance() && (
              <tr class={getRowClass(3)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Princípio Ativo
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.substance?.slug
                    ? (
                      <a
                        href={`/${contentPage.substance.slug}/pa`}
                        class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                      >
                        {contentPage.substance.substanceName}
                      </a>
                    )
                    : (
                      contentPage.substance?.substanceName
                    )}
                </td>
              </tr>
            )}

            {/* Categoria do Medicamento */}
            {hasCategoryMedicine() && (
              <tr class={getRowClass(4)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Categoria do {category.path?.includes("Beleza e Saúde")
                    ? "Produto"
                    : "Medicamento"}
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {(() => {
                    const mainCategory = contentPage.product?.productCategory
                      ?.find(
                        (cat) => cat.mainCategory,
                      );
                    if (mainCategory?.category?.slug) {
                      return (
                        <a
                          href={`/${mainCategory.category.slug}/c`}
                          class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                        >
                          {mainCategory.category.categoryName}
                        </a>
                      );
                    }
                    return mainCategory?.category?.categoryName;
                  })()}
                </td>
              </tr>
            )}

            {contentPage?.weightKg && (
              <tr>
                <td class="py-3 px-4 font-medium text-content w-1/2">Peso</td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage?.weightKg * 1000}g
                </td>
              </tr>
            )}

            {/* Classe Terapêutica */}
            {hasClasseTerapeutica() && (
              <tr class={getRowClass(5)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Classe Terapêutica
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.therapeuticClass?.slug
                    ? (
                      <a
                        href={`/b/${
                          contentPage?.therapeuticClass?.slug?.replace(
                            "-root",
                            "",
                          )
                        }`}
                        class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                      >
                        {contentPage.therapeuticClass.therapeuticClassName}
                      </a>
                    )
                    : (
                      contentPage.therapeuticClass?.therapeuticClassName
                    )}
                </td>
              </tr>
            )}

            {/* Especialidades */}
            {hasEspecialidades() && (
              <tr class={getRowClass(6)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Especialidades
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.product?.medicalSpecialty
                    ?.map((specialty) => specialty.medicalSpecialtyName)
                    .join(", ")}
                </td>
              </tr>
            )}

            {/* Componente Island para preços baseados no CEP - renderizado no cliente */}
            <ProductPriceSpecificationsIsland
              productSlug={contentPage.product?.slug || ""}
              variationSlug={contentPage.slug || ""}
            />

            {/* Registro no Ministério da Saúde */}
            {hasRegistroMinisterio() && (
              <tr class={getRowClass(7)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Registro no Ministério da Saúde
                </td>
                <td class="py-3 px-4 text-gray-800">{contentPage.registry}</td>
              </tr>
            )}

            {/* Código de Barras */}
            {hasCodigoBarras() && (
              <tr class={getRowClass(8)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Código de Barras
                </td>
                <td class="py-3 px-4 text-gray-800">{contentPage.ean}</td>
              </tr>
            )}

            {/* Temperatura de Armazenamento */}
            {hasTemperaturaArmazenamento() && (
              <tr class={getRowClass(9)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Temperatura de Armazenamento
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.storageTemperature?.storageTemperatureName}
                </td>
              </tr>
            )}

            {/* Produto Refrigerado */}
            {isCategoryMedicine && hasProdutoRefrigerado() && (
              <tr class={getRowClass(10)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Produto Refrigerado
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.storageTemperature?.storageTemperatureName
                      ?.toLowerCase()
                      .includes("temperatura ambiente")
                    ? "Este produto não precisa ser refrigerado"
                    : "Este produto precisa ser refrigerado"}
                </td>
              </tr>
            )}
            {genericProducts && genericProducts.length > 0 && (
              <tr>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Medicamentos genéricos:
                </td>
                <td class="py-3 px-4 text-gray-800">
                  <span>
                    {genericProducts?.map((generic, i) => (
                      <span key={i}>
                        {generic.spotInformation
                          ? (
                            <a
                              href={(() => {
                                const cleanUrl =
                                  generic.spotInformation?.replace(
                                    "https://consultaremedios.com.br",
                                    "",
                                  ) || "";

                                const urlParts = cleanUrl.split("/");
                                const productUrlParts = [];

                                for (let i = 0; i < urlParts.length; i++) {
                                  const part = urlParts[i];
                                  if (i <= 1) {
                                    productUrlParts.push(part);
                                  } else if (part.length === 1) {
                                    productUrlParts.push(part);
                                    break;
                                  }
                                }

                                return productUrlParts.join("/");
                              })()}
                              class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                            >
                              {generic.productName}
                            </a>
                          )
                          : (
                            <p class="text-primary hover:text-inherit underline underline-offset-[3.5px]">
                              {generic.productName}
                            </p>
                          )}
                        {i < (genericProducts?.length || 0) - 1 ? ", " : ""}
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            )}

            {/* Doenças Relacionadas */}
            {hasDoencasRelacionadas() && (
              <tr class={getRowClass(11)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Doenças Relacionadas
                </td>
                <td class="py-3 px-4 text-gray-800">
                  <span>
                    {contentPage.substance?.disease?.map((doenca, i) => (
                      <span key={i}>
                        {doenca.slug
                          ? (
                            <a
                              href={`/doenca/${doenca.slug}`}
                              class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                            >
                              {doenca.diseaseName}
                            </a>
                          )
                          : (
                            doenca.diseaseName
                          )}
                        {i < (contentPage.substance?.disease?.length || 0) - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            )}

            {/* Bula do Paciente */}
            {hasBulaPaciente() && (
              <tr class={getRowClass(12)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Bula do Paciente
                </td>
                <td class="py-3 px-4 text-gray-800">
                  <a
                    href={`/${contentPage.product?.slug}/bula`}
                    class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                    rel="noopener noreferrer"
                  >
                    {`Bula do ${contentPage?.product.title}`}
                  </a>
                </td>
              </tr>
            )}

            {/* Bula do Profissional */}
            {hasBulaProfissional() && (
              <tr class={getRowClass(13)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Bula do Profissional
                </td>
                <td class="py-3 px-4 text-gray-800">
                  <a
                    href={contentPage.product?.leafletPro || "#"}
                    class="text-primary hover:text-inherit underline underline-offset-[3.5px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`Bula do Profissional do ${contentPage?.product.title}`}
                  </a>
                </td>
              </tr>
            )}

            {/* Modo de Uso */}
            {hasModoUso() && (
              <tr class={getRowClass(14)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Modo de Uso
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.administrationMethod?.includes("oral")
                    ? "Uso oral"
                    : contentPage.administrationMethod}
                </td>
              </tr>
            )}

            {/* Pode Partir */}
            {isCategoryMedicine && hasCanBeSplitted() && (
              <tr class={getRowClass(15)}>
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  Pode partir
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {contentPage.canBeSplitted
                    ? "Esta apresentação pode ser partida"
                    : "Esta apresentação não pode ser partida"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductSpecifications;
