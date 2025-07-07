// Arquivo: components/product/ContentProductPage/ProductMainSpecifications.tsx
import { Product } from "../../../commerce/ContentTypes.ts";
import type { Product as ProductMain } from "../../../commerce/types.ts";
import { ProductPriceSpecificationsIsland } from "../../../islands/ProductPriceSpecificationsIsland.tsx";
// import { formatarTextoParaHref } from "../../../sdk/format.ts";
interface ProductMainSpecificationsProps {
  contentPage: Product;
  product?: ProductMain;
  isHaveParent?: number;
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
 * Componente que exibe as especificações técnicas do produto principal em formato de tabela
 * Versão adaptada para receber Product ao invés de ProductVariation
 */
export function ProductMainSpecifications({
  contentPage,
  product,
  genericProducts,
  isHaveParent,
}: ProductMainSpecificationsProps) {
  // Lista para armazenar as especificações
  const specifications = [];

  // Fabricante - Usar commercialName se disponível, senão factoryName
  if (contentPage.factory) {
    const fabricanteName = contentPage.factory.commercialName ||
      contentPage.factory.factoryName;
    if (fabricanteName) {
      specifications.push({
        label: "Fabricante:",
        value: fabricanteName,
        link: contentPage.factory.slug
          ? `/fabricante/${contentPage.factory.slug}`
          : null,
      });
    }
  }

  // Marca
  if (contentPage.brand) {
    const marcaName = contentPage.brand.brandName;
    if (marcaName) {
      specifications.push({
        label: "Marca:",
        value: marcaName,
        link: contentPage.brand.slug
          ? `/marca/${contentPage.brand.slug}`
          : null,
      });
    }
  }

  // Tipo do Medicamento - Acesso direto ao classification
  if (contentPage.classification?.classificationName) {
    specifications.push({
      label: "Tipo do Medicamento:",
      value: contentPage.classification.classificationName,
    });
  }

  // Necessita de Receita
  if (contentPage.prescriptionType?.prescriptionTypeName) {
    const receitaText = contentPage.prescriptionType.prescriptionTypeName;

    specifications.push({
      label: "Necessita de Receita:",
      value: receitaText,
    });
  }

  // Princípio Ativo
  if (contentPage.substance?.substanceName) {
    specifications.push({
      label: "Princípio Ativo:",
      value: contentPage.substance.substanceName,
      link: contentPage.substance.slug
        ? `/${contentPage.substance.slug}/pa`
        : null,
    });
  }

  const isCategoryMedicine = contentPage?.productCategory?.find((category) =>
    category.category?.path?.includes("Medicamentos")
  );

  // Categoria do Medicamento - encontrar a categoria principal (mainCategory: true)
  const mainCategory = contentPage.productCategory?.find(
    (cat) => cat.mainCategory,
  );
  if (mainCategory?.category?.categoryName) {
    specifications.push({
      label: isCategoryMedicine
        ? "Categoria do Medicamento:"
        : "Categoria do Produto:",
      value: mainCategory.category.categoryName,
      link: mainCategory.category.slug
        ? `/${mainCategory.category.slug}/c`
        : null,
    });
  }

  // Classe Terapêutica
  if (contentPage.therapeuticCLass?.therapeuticClassName) {
    specifications.push({
      label: "Classe Terapêutica:",
      value: contentPage.therapeuticCLass.therapeuticClassName,
      link: contentPage.therapeuticCLass?.slug.replace("-root", "")
        ? `/b/${contentPage.therapeuticCLass?.slug.replace("-root", "")}`
        : null,
    });
  }

  // Especialidades
  if (contentPage.medicalSpecialty && contentPage.medicalSpecialty.length > 0) {
    const especialidades = contentPage.medicalSpecialty
      .map((specialty) => specialty.medicalSpecialtyName)
      .join(", ");

    specifications.push({
      label: "Especialidades:",
      value: especialidades,
    });
  }

  // Doenças Relacionadas
  if (
    contentPage.substance?.disease &&
    contentPage.substance.disease.length > 0
  ) {
    // Mapear as doenças para objetos com nome e slug
    const doencas = contentPage.substance.disease.map((doenca) => ({
      nome: doenca.diseaseName,
      slug: doenca.slug ? `/doenca/${doenca.slug}` : null,
    }));

    // Adicionar à lista de especificações apenas se houver doenças
    if (doencas.length > 0) {
      specifications.push({
        label: "Doenças Relacionadas:",
        value: doencas.map((d) => d.nome).join(", "),
        complexLinks: doencas, // Para renderizar os links individualmente
      });
    }
  }

  // Bula do Paciente
  if (contentPage.leaflet) {
    specifications.push({
      label: "Bula do Paciente:",
      value: `Bula do ${contentPage.title}`,
      link: `/${contentPage.slug}/bula`,
      isExternal: false,
    });
  }

  // Bula do Profissional
  if (contentPage.leafletPro) {
    specifications.push({
      label: "Bula do Profissional:",
      value: `Bula do Profissional do ${contentPage.title}`,
      link: contentPage.leafletPro,
      isExternal: true,
    });
  }

  const variant =
    contentPage?.variation && (contentPage?.variation?.length ?? 0) > 0
      ? contentPage?.variation[0]
      : null;

  const packageItem = variant?.packageItem.find((item) => item.id);

  // console.log(isCategoryMedicine);
  // Nota: Informações específicas da variação como modo de uso,
  // temperatura de armazenamento, código de barras, e capacidade de partir
  // não estão disponíveis diretamente no objeto Product

  // Se não tiver especificações, não renderiza o componente
  if (specifications.length === 0) return null;

  // const brandProperty = product?.additionalProperty?.find(
  //   (property) => property.name === "Marca" && property.value
  // );

  return (
    <div className="mb-8">
      <h2 className="font-inter text-[1.75rem] font-medium leading-[1.2] tracking-[-.03125rem] lg:text-[2rem] border-t border-gray-200 py-4 lg:px-4">
        Especificações sobre o {contentPage.title}
      </h2>
      <h3 className="text-2xl font-medium leading-[1.2] xl:text-[1.75rem] my-4 text-[#212529] lg:px-4">
        Caracteristicas Principais
      </h3>

      <div className="overflow-x-auto lg:px-2">
        <table className="min-w-full bg-white border-collapse border border-[#dee2e6] rounded text-sm">
          <tbody class="table-specification">
            {
              /* {brandProperty && (
              <tr>
                <td class="py-3 px-4 font-medium text-content w-1/2">Marca</td>
                <td class="py-3 px-4 text-gray-800">
                  <a
                    class="text-[#009999] hover:text-inherit underline underline-offset-[3.5px]"
                    arial-label="link brand"
                    href={`/marca/${formatarTextoParaHref(
                      brandProperty?.value ?? ""
                    )}`}
                  >
                    {brandProperty.value}
                  </a>
                </td>
              </tr>
            )} */
            }
            {specifications.map((spec, index) => (
              <tr
                key={index}
                class={index % 2 === 0 ? "bg-[#e9ecef]" : "bg-white"}
              >
                <td class="py-3 px-4 font-medium text-content w-1/2">
                  {spec.label}
                </td>
                <td class="py-3 px-4 text-gray-800">
                  {spec.complexLinks
                    ? (
                      // Renderiza links múltiplos para doenças relacionadas
                      <span>
                        {spec.complexLinks.map((item, i) => (
                          <span key={i}>
                            {item.slug
                              ? (
                                <a
                                  href={item.slug}
                                  class="text-[#009999] hover:text-inherit underline underline-offset-[3.5px]"
                                >
                                  {item.nome}
                                </a>
                              )
                              : (
                                item.nome
                              )}
                            {i < spec.complexLinks.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    )
                    : spec.link
                    ? (
                      <a
                        href={spec.link}
                        class="text-[#009999] hover:text-inherit underline underline-offset-[3.5px]"
                        target={spec.isExternal ? "_blank" : "_self"}
                        rel={spec.isExternal ? "noopener noreferrer" : ""}
                      >
                        {spec.value}
                      </a>
                    )
                    : (
                      spec.value
                    )}
                </td>
              </tr>
            ))}
            {(isHaveParent ?? 0) < 2 && (
              <>
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
                                  href={`${
                                    generic.spotInformation?.replace(
                                      "https://consultaremedios.com.br",
                                      "",
                                    )
                                  }`}
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
                <ProductPriceSpecificationsIsland
                  productSlug={contentPage?.slug || ""}
                  variationSlug={variant?.slug || ""}
                />
                {variant &&
                  variant?.classification &&
                  isCategoryMedicine &&
                  variant.classification.classificationName && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Tipo do Medicamento:
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      {variant.classification.classificationName}
                    </td>
                  </tr>
                )}
                {variant && variant.registry && isCategoryMedicine && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Registro no Ministério da Saúde:
                    </td>
                    <td class="py-3 px-4 text-gray-800">{variant.registry}</td>
                  </tr>
                )}
                {product && product.sku && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Código de Barras:
                    </td>
                    <td class="py-3 px-4 text-gray-800">{product.sku}</td>
                  </tr>
                )}
                {contentPage?.weightKg && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Peso
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      {contentPage?.weightKg * 1000}g
                    </td>
                  </tr>
                )}
                {variant &&
                  variant.storageTemperature &&
                  isCategoryMedicine &&
                  variant.storageTemperature?.storageTemperatureName && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Temperatura de Armazenamento:
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      {variant.storageTemperature?.storageTemperatureName}
                    </td>
                  </tr>
                )}
                {variant &&
                  variant.storageTemperature &&
                  isCategoryMedicine && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Produto Refrigerado:
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      {variant?.storageTemperature?.storageTemperatureName
                          ?.toLowerCase()
                          .includes("temperatura ambiente")
                        ? "Este produto não precisa ser refrigerado"
                        : "Este produto precisa ser refrigerado"}
                    </td>
                  </tr>
                )}
                {variant &&
                  packageItem?.administrationMethod &&
                  isCategoryMedicine &&
                  packageItem?.administrationMethod
                    ?.administrationMethodName &&
                  (
                    <tr>
                      <td class="py-3 px-4 font-medium text-content w-1/2">
                        Modo de Uso:
                      </td>
                      <td class="py-3 px-4 text-gray-800">
                        {packageItem?.administrationMethod
                          ?.administrationMethodName}
                      </td>
                    </tr>
                  )}
                {variant && isCategoryMedicine && (
                  <tr>
                    <td class="py-3 px-4 font-medium text-content w-1/2">
                      Pode partir:
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      {variant?.canBeSplitted
                        ? "Esta apresentação não pode ser partida"
                        : "Esta apresentação pode ser partida"}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductMainSpecifications;
