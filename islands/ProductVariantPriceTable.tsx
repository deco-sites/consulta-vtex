// Arquivo: islands/ProductVariantPriceTable.tsx
import { useSignal } from "@preact/signals";
import { ProductVariation } from "../commerce/ContentTypes.ts";
import {
  VariantPriceLoader,
  VariationPriceData,
} from "./VariantPriceLoader.tsx";

interface ProductVariantPriceTableProps {
  productSlug: string;
  variations: ProductVariation[];
}

/**
 * Componente client-side (island) para exibir a tabela de preços de variações
 * Este componente deve ser incluído no ProductVariantComparison.tsx
 */
export function ProductVariantPriceTable({
  productSlug,
  variations,
}: ProductVariantPriceTableProps) {
  // States para armazenar os preços carregados
  const userState = useSignal<string>("SP");
  const priceData = useSignal<VariationPriceData[]>([]);
  const isDataLoaded = useSignal<boolean>(false);

  // Callback para atualizar os preços quando o VariantPriceLoader os carregar
  const handlePriceUpdate = (data: VariationPriceData[]) => {
    if (data.length > 0) {
      // Atualizar o estado com base no primeiro item (todos devem ter o mesmo estado)
      userState.value = data[0].state;

      // Armazenar todos os dados de preço
      priceData.value = data;

      // Marcar dados como carregados
      isDataLoaded.value = true;
    } else {
      console.warn("[ProductVariantPriceTable] Recebeu array de preços vazio");
    }
  };

  // Função para formatar valores de moeda
  const formatCurrency = (
    value: string | number | undefined | null,
  ): string => {
    if (value === undefined || value === null || value === "") return "R$ -";

    // Converter para string se for número
    const stringValue = String(value);

    // Remover asteriscos se existirem
    const cleanValue = stringValue.replace(/\*/g, "");

    // Tentar extrair o número
    const numMatch = cleanValue.match(/(\d+[\.,]?\d*)/);
    if (!numMatch) return "R$ -";

    // Converter ponto para vírgula e adicionar prefixo R$
    const numValue = Number(numMatch[0].replace(",", "."));
    if (isNaN(numValue)) return "R$ -";

    return `R$ ${numValue?.toFixed(2)?.replace(".", ",")}`;
  };

  // Função para obter preço para uma variação específica
  const getPriceForVariation = (
    variationId: number,
    priceType: "pmc" | "pf",
  ) => {
    const data = priceData.value.find(
      (item) => item.variationId === variationId,
    );
    return data ? data[priceType] : undefined;
  };

  // Verificar se há preços disponíveis
  const hasPMCPrices = () => {
    // Verificar se há pelo menos uma variação com preço PMC não nulo
    return priceData.value.some(
      (item) => item.pmc !== undefined && item.pmc !== null,
    );
  };

  const hasPFPrices = () => {
    // Verificar se há pelo menos uma variação com preço PF não nulo
    return priceData.value.some(
      (item) => item.pf !== undefined && item.pf !== null,
    );
  };

  // Verificar se há pelo menos um preço válido (PMC ou PF) para exibir
  const hasAnyValidPrice = () => {
    return hasPMCPrices() || hasPFPrices();
  };

  return (
    <>
      {/* Componente que carrega os preços baseados no CEP */}
      <VariantPriceLoader
        productSlug={productSlug}
        variations={variations}
        onPriceUpdate={handlePriceUpdate}
      />

      {/* Não renderiza nada se não houver pelo menos um preço válido */}
      {isDataLoaded.value && hasAnyValidPrice() && (
        <>
          {/* Preço Máximo ao Consumidor */}
          {hasPMCPrices() && (
            <tr>
              <th className="p-2 text-left min-w-[250px] text-sm">
                Preço Máximo ao Consumidor/{userState.value}
              </th>
              {variations.map((variation) => (
                <td
                  key={`pmc-${variation.id}`}
                  className={`p-2 min-w-[12.5rem] text-sm`}
                >
                  {formatCurrency(getPriceForVariation(variation.id, "pmc"))}
                </td>
              ))}
            </tr>
          )}

          {/* Preço de Fábrica */}
          {hasPFPrices() && (
            <tr className={`bg-gray-100`}>
              <th className="p-2 text-left min-w-[12.5rem] text-sm">
                Preço de Fábrica/{userState.value}
              </th>
              {variations.map((variation) => (
                <td
                  key={`pf-${variation.id}`}
                  className={`p-2 min-w-[12.5rem] text-sm`}
                >
                  {formatCurrency(getPriceForVariation(variation.id, "pf"))}
                </td>
              ))}
            </tr>
          )}
        </>
      )}
    </>
  );
}

export default ProductVariantPriceTable;
