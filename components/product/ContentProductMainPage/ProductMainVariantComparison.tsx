// Arquivo: components/product/ContentProductPage/ProductMainVariantComparison.tsx

import { Product } from "../../../commerce/ContentTypes.ts";
import { ProductMainVariantPriceTable } from "../../../islands/ProductMainVariantPriceTable.tsx";
import InfoTooltip from "../InfoTooltip.tsx";

interface ProductMainVariantComparisonProps {
  product: Product;
}

/**
 * Componente que compara variações de um produto principal
 * Versão adaptada para receber diretamente um Product
 */
function ProductMainVariantComparison({
  product,
}: ProductMainVariantComparisonProps) {
  // Verificação simples e direta se existem variações para comparar
  // Fazemos isso antes de qualquer processamento para evitar flashes na tela
  const hasMultipleVariations = product?.variation &&
    product.variation.length > 1;

  // Se não tiver múltiplas variações, não exibe nada
  if (!hasMultipleVariations) {
    return null;
  }

  // Verificação se o produto é um medicamento (productType === 1)
  const isMedicine = product?.productType === 1;

  // Obter variações de forma segura
  const variations = product.variation || [];

  const uniqueVariations = variations.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.title === item.title),
  );

  // Verifica se todas as variações têm o campo com valor válido
  const allVariationsHaveField = (field: string) => {
    return uniqueVariations.some((variation) => {
      // @ts-ignore - Acessando campo dinâmico
      const value = variation[field];
      return value !== undefined && value !== null && value !== "";
    });
  };

  // Funções específicas para validar campos mais complexos
  const allVariationsHaveDose = () => {
    return uniqueVariations.some((variation) => {
      // console.log(variation);
      const dose = variation.dose ??
        variation.packageItem?.[0]?.packageItemSubstance?.[0]?.quantity ??
        variation.packageItem?.[0]?.packageItemSubstance?.[0]?.unit?.unitName;
      return dose;
    });
  };

  const allVariationsHavePharmaceuticForm = () => {
    return uniqueVariations.every((variation) => {
      const form = variation?.pharmaceuticForm ||
        variation.packageItem?.[0]?.pharmaceuticForm?.pharmaceuticFormName;
      return !!form;
    });
  };

  const allVariationsHavePackageQuantity = () => {
    return uniqueVariations.some((variation) => {
      const quantity = variation.packageQuantity ||
        variation.packageItem?.[0]?.unitQuantity ||
        (variation.packageItem?.[0]?.volume &&
          variation.packageItem?.[0]?.unit?.unitName);
      return !!quantity;
    });
  };

  const allVariationsHaveAdministrationMethod = () => {
    return uniqueVariations.some((variation) => {
      const method = variation.administrationMethod ||
        variation.packageItem?.[0]?.administrationMethod
          ?.administrationMethodName;

      return !!method;
    });
  };

  const allVariationsHaveSubstance = () => {
    return uniqueVariations.some(
      (variation) => variation.substance && variation.substance.substanceName,
    );
  };

  return uniqueVariations.length > 1
    ? (
      <div class="product-variant-comparison mt-8 mb-8 lg:px-4 px-[10px]">
        <h2 class="lg:text-2xl text-xl font-bold mb-4">
          Descubra a Melhor Opção de {product.title} para Você
        </h2>
        <p class="text-gray-600 mb-6">
          Compare e escolha entre variações com facilidade
        </p>

        {/* Tabela de comparação com imagens incorporadas */}
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <tbody>
              {/* Primeira linha: Imagens dos produtos */}
              <tr>
                <th class="p-2 text-left w-1/4"></th>
                {uniqueVariations.map((variation, index) => {
                  // Consideraremos a primeira variação como destacada
                  const isFirst = index === 0;

                  // Encontrar imagem principal da variação
                  const mainImage = variation.variationImage?.find((img) =>
                    img.main
                  ) ||
                    (variation.variationImage?.length
                      ? variation.variationImage[0]
                      : null);

                  return (
                    <td
                      key={`image-${variation.id}`}
                      class={`p-2 text-center text-sm`}
                    >
                      <a
                        href={`/${variation.slug}/p`}
                        class={`block ${isFirst ? "font-semibold" : ""}`}
                      >
                        <div class="flex flex-col items-center">
                          {/* Imagem da variação */}
                          <div class="w-[120px] h-[120px] mx-auto mb-2">
                            {mainImage && (
                              <img
                                src={mainImage.image}
                                alt={mainImage.alt || variation.title}
                                class="object-contain w-full h-full"
                                loading={"lazy"}
                                width={120}
                                height={120}
                              />
                            )}
                          </div>

                          {/* Título da variação - destacando a primeira */}
                          <a
                            href={`/${variation.slug}/p`}
                            class="text-[#009999] underline underline-offset-[3.5px] text-sm font-normal font-['Inter'] hover:text-inherit text-start"
                          >
                            {product.title} {variation.title}
                          </a>
                        </div>
                      </a>
                    </td>
                  );
                })}
              </tr>

              {/* Dose - Exibir apenas se todas as variações tiverem este dado */}
              {allVariationsHaveDose() && (
                <tr class={`bg-gray-100`}>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm flex items-center">
                    Dose
                    <InfoTooltip text="Quantidade de princípio ativo por unidade, como 50mg por comprimido." />
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`dose-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.dose ||
                        variation.packageItem?.[0]?.packageItemSubstance?.[0]
                            ?.quantity +
                          (variation.packageItem?.[0]?.packageItemSubstance?.[0]
                            ?.unit?.unitName || "mg/mL")}
                    </td>
                  ))}
                </tr>
              )}

              {/* Forma Farmacêutica - Exibir apenas se todas as variações tiverem este dado */}
              {allVariationsHavePharmaceuticForm() && (
                <tr>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm flex items-center">
                    Forma Farmacêutica
                    <InfoTooltip text="Estado físico do medicamento, como comprimido, cápsula ou solução." />
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`form-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation?.pharmaceuticForm ||
                        variation?.packageItem?.[0]?.pharmaceuticForm
                          ?.pharmaceuticFormName}
                    </td>
                  ))}
                </tr>
              )}

              {/* Quantidade na embalagem - Exibir apenas se todas as variações tiverem este dado */}
              {isMedicine && allVariationsHavePackageQuantity() && (
                <tr class={`bg-gray-100`}>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm flex items-center">
                    Quantidade na embalagem
                    <InfoTooltip text="Número de unidades do produto por embalagem." />
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`qty-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.packageQuantity ||
                        `${
                          variation.packageItem?.[0]?.volume ||
                          variation.packageItem?.[0]?.unitQuantity ||
                          ""
                        } ${variation.packageItem?.[0]?.unit?.unitName || ""}`}
                    </td>
                  ))}
                </tr>
              )}

              {/* Modo de uso - Exibir apenas se todas as variações tiverem este dado */}
              {allVariationsHaveAdministrationMethod() && (
                <tr>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm">
                    Modo de uso
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`admin-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.administrationMethod ||
                        variation.packageItem?.[0]?.administrationMethod
                          ?.administrationMethodName}
                    </td>
                  ))}
                </tr>
              )}

              {/* Substância ativa - Exibir apenas se todas as variações tiverem este dado */}
              {allVariationsHaveSubstance() && (
                <tr class={`bg-gray-100`}>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm">
                    Substância ativa
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`substance-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      <a
                        href={`/${variation.substance?.slug}/pa`}
                        class="text-[#009999] underline underline-offset-[3.5px] text-sm font-normal font-['Inter'] hover:text-inherit"
                      >
                        {variation.substance?.substanceName}
                      </a>
                    </td>
                  ))}
                </tr>
              )}

              {/* Componente island para preços */}
              <ProductMainVariantPriceTable
                productSlug={product.slug}
                variations={uniqueVariations}
              />

              {/* Tipo do Medicamento - Exibir apenas se todas as variações tiverem este dado E for um medicamento */}
              {isMedicine && allVariationsHaveField("classification") && (
                <tr>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm flex items-center">
                    Tipo do Medicamento
                    <InfoTooltip text="Categoria do medicamento (Exemplo: Genérico, Referência ou Similar)." />
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`type-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.classification?.classificationName ||
                        "Genérico"}
                    </td>
                  ))}
                </tr>
              )}

              {/* Pode partir? - Exibir apenas se todas as variações tiverem este dado E for um medicamento */}
              {isMedicine && allVariationsHaveField("canBeSplitted") && (
                <tr class={`bg-gray-100`}>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm flex items-center">
                    Pode partir?
                    <InfoTooltip text="Quando permitido, você pode economizar e/ou ajustar a dose." />
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`split-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.canBeSplitted
                        ? "Sim"
                        : "Este medicamento não pode ser partido"}
                    </td>
                  ))}
                </tr>
              )}

              {/* Registro Anvisa - Exibir apenas se todas as variações tiverem este dado */}
              {allVariationsHaveField("registry") && (
                <tr>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm">
                    Registro Anvisa
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`registry-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.registry}
                    </td>
                  ))}
                </tr>
              )}

              {/* Precisa de receita - Exibir apenas se todas as variações tiverem este dado */}
              {isMedicine &&
                uniqueVariations.some(
                  (v) => v.prescriptionType?.prescriptionTypeName,
                ) && (
                <tr className="bg-gray-100">
                  <th className="p-2 text-left min-w-[12.5rem] text-sm">
                    Precisa de receita
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`prescription-${variation.id}`}
                      className="p-2 min-w-[12.5rem] text-sm"
                    >
                      {variation.prescriptionType?.prescriptionTypeName !==
                          "Isento de Prescrição Médica"
                        ? "Sim, precisa de receita"
                        : "Não precisa de receita"}
                    </td>
                  ))}
                </tr>
              )}

              {/* Tipo da Receita - Exibir apenas se todas as variações tiverem este dado */}
              {uniqueVariations.some(
                (v) =>
                  v.prescriptionType && v.prescriptionType.prescriptionTypeName,
              ) && (
                <tr>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm">
                    Tipo da Receita
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`prescriptionType-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.prescriptionType?.prescriptionTypeName}
                    </td>
                  ))}
                </tr>
              )}

              {/* Código de Barras - Exibir apenas se todas as variações tiverem este dado */}
              {allVariationsHaveField("ean") && (
                <tr class={`bg-gray-100`}>
                  <th class="p-2 text-left min-w-[12.5rem] text-sm">
                    Código de Barras
                  </th>
                  {uniqueVariations.map((variation) => (
                    <td
                      key={`ean-${variation.id}`}
                      class={`p-2 min-w-[12.5rem] text-sm`}
                    >
                      {variation.ean}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
    : <></>;
}

export default ProductMainVariantComparison;
