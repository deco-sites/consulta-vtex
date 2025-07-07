// Arquivo: islands/ProductMainVariantPriceTable.tsx
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { useUI } from "../sdk/useUI.ts";
import { invoke } from "../runtime.ts";
import { ProductVariation } from "../commerce/ContentTypes.ts";

interface ProductMainVariantPriceTableProps {
  productSlug: string;
  variations: ProductVariation[];
}

interface PriceData {
  variationId: number;
  state: string;
  pmc?: number;
  pf?: number;
  cep?: string;
}

/**
 * Componente Island para exibir preços de múltiplas variações em uma tabela comparativa
 */
export function ProductMainVariantPriceTable({
  productSlug,
  variations,
}: ProductMainVariantPriceTableProps) {
  // Estado local e UI
  const { cepDrawer } = useUI();
  const cep = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);
  const userState = useSignal<string>("SP");
  const priceData = useSignal<PriceData[]>([]);
  const isDataLoaded = useSignal<boolean>(false);
  const cepChanged = useSignal<boolean>(false);

  // Função para obter o CEP dos cookies no navegador
  const getCepFromCookies = (): string => {
    if (typeof window === "undefined") return "";
    const matches = document.cookie.match(/user_cep=([^;]+)/);
    return matches ? decodeURIComponent(matches[1]) : "";
  };

  /**
   * Função para processar o slug da variação, removendo o prefixo do produto se necessário
   */
  const processVariationSlug = (
    productSlug: string,
    fullVariationSlug: string,
  ): string => {
    // Verifica se o slug da variação começa com o slug do produto seguido por "/"
    const prefixPattern = new RegExp(`^${productSlug}/`);
    if (prefixPattern.test(fullVariationSlug)) {
      return fullVariationSlug.replace(prefixPattern, "");
    }

    // Verifica se o slug da variação contém o slug do produto sem barra
    if (fullVariationSlug.startsWith(productSlug)) {
      return fullVariationSlug.substring(productSlug.length);
    }

    return fullVariationSlug;
  };

  // Função para buscar dados atualizados usando o CepPriceLoader via invoke
  async function fetchUpdatedPrices() {
    if (!productSlug || !variations?.length || !cep.value) {
      return;
    }

    try {
      isLoading.value = true;

      // Array para armazenar os preços de todas as variações
      const allPriceData: PriceData[] = [];

      // Buscar preços para cada variação
      for (const variation of variations) {
        if (!variation.slug) {
          console.warn(
            `[ProductMainVariantPriceTable] Variação ${variation.id} não tem slug`,
          );
          continue;
        }

        const processedVariationSlug = processVariationSlug(
          productSlug,
          variation.slug,
        );

        try {
          // Chamar o CepPriceLoader via invoke com o slug processado
          const priceData = await invoke.site.loaders.CepPriceLoader({
            product: productSlug,
            slug: processedVariationSlug,
            cep: cep.value,
          });

          // Atualizar o estado sempre que recebemos dados válidos
          if (priceData.state) {
            userState.value = priceData.state;
          }

          // Adicionar os preços ao array
          allPriceData.push({
            variationId: variation.id,
            state: priceData.state || "SP",
            pmc: priceData.pmc,
            pf: priceData.pf,
            cep: cep.value,
          });
        } catch (error) {
          console.error(
            "[ProductMainVariantPriceTable] Erro ao buscar preço para variação",
            variation.id,
            error,
          );
          // Se falhar uma variação, ainda adicionamos com dados padrão
          allPriceData.push({
            variationId: variation.id,
            state: userState.value,
            cep: cep.value,
          });
        }
      }

      // Salvar os dados no signal mesmo se estiver vazio
      priceData.value = allPriceData;
      isDataLoaded.value = true;
    } catch (error) {
      console.error(
        "[ProductMainVariantPriceTable] Erro ao buscar preços:",
        error,
      );
      // Marcar como carregado mesmo em caso de erro para não ficar em loop
      isDataLoaded.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  // Efeito para obter o CEP e carregar preços quando o componente é montado ou quando o CEP muda
  useEffect(() => {
    // Obtém o CEP do drawer ou dos cookies
    if (typeof window !== "undefined") {
      const cookieCep = getCepFromCookies();

      const newCep = cepDrawer.value || cookieCep || "01153000"; // CEP padrão como fallback

      // Sempre forçar o recarregamento se o CEP mudar
      if (cep.value !== newCep) {
        // Resetar o estado para forçar atualização
        userState.value = "SP"; // Reset estado padrão
        cepChanged.value = true;
        cep.value = newCep;
        isDataLoaded.value = false;

        // Buscar preços imediatamente
        if (!isLoading.value) {
          fetchUpdatedPrices();
        }
      } else if (!cep.value) {
        // Caso inicial - primeira carga
        cep.value = newCep;
        isDataLoaded.value = false;

        // Buscar preços imediatamente
        if (!isLoading.value) {
          fetchUpdatedPrices();
        }
      }
    }
  }, [cepDrawer.value, productSlug]);

  // Verificar se há preços válidos para exibir
  const hasPMCPrices = () => {
    return priceData.value.some(
      (item) => item.pmc !== undefined && item.pmc !== null,
    );
  };

  const hasPFPrices = () => {
    return priceData.value.some(
      (item) => item.pf !== undefined && item.pf !== null,
    );
  };

  // Obter o estado mais recente dos dados de preço
  const getLatestState = () => {
    if (priceData.value.length > 0 && priceData.value[0].state) {
      return priceData.value[0].state;
    }
    return userState.value;
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

  // Formatar preço para exibição
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return "R$ -";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  // Se dados estão carregados, use o estado mais recente
  const displayState = isDataLoaded.value ? getLatestState() : userState.value;

  return (
    <>
      {/* Estados de carregamento ou dados carregados */}
      {isLoading.value
        ? (
          // Estado de carregamento
          <>
            <tr>
              <th className="p-2 text-left text-sm min-w-[250px]">
                Preço Máximo ao Consumidor
              </th>
              {variations.map((variation) => (
                <td
                  key={`pmc-loading-${variation.id}`}
                  className="p-2 text-gray-400 text-sm min-w-[12.5rem]"
                >
                  Carregando...
                </td>
              ))}
            </tr>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-sm min-w-[12.5rem]">
                Preço de Fábrica
              </th>
              {variations.map((variation) => (
                <td
                  key={`pf-loading-${variation.id}`}
                  className="p-2 text-gray-400 text-sm min-w-[12.5rem]"
                >
                  Carregando...
                </td>
              ))}
            </tr>
          </>
        )
        : isDataLoaded.value
        ? (
          // Dados carregados
          <>
            {/* Preço Máximo ao Consumidor */}
            {hasPMCPrices() && (
              <tr>
                <th className="p-2 text-left text-sm min-w-[250px]">
                  Preço Máximo ao Consumidor/{displayState}
                </th>
                {variations.map((variation) => (
                  <td
                    key={`pmc-${variation.id}`}
                    className={`p-2 font-medium text-sm min-w-[12.5rem]`}
                  >
                    {formatCurrency(getPriceForVariation(variation.id, "pmc"))}
                  </td>
                ))}
              </tr>
            )}

            {/* Preço de Fábrica */}
            {hasPFPrices() && (
              <tr className={`bg-gray-100`}>
                <th className="p-2 text-left text-sm min-w-[12.5rem]">
                  Preço de Fábrica/{displayState}
                </th>
                {variations.map((variation) => (
                  <td
                    key={`pf-${variation.id}`}
                    className={`p-2 text-sm min-w-[12.5rem]`}
                  >
                    {formatCurrency(getPriceForVariation(variation.id, "pf"))}
                  </td>
                ))}
              </tr>
            )}
          </>
        )
        : (
          // Estado inicial - ainda não começou a carregar
          <>
            <tr>
              <th className="p-2 text-left text-sm min-w-[250px]">
                Preço Máximo ao Consumidor
              </th>
              {variations.map((variation) => (
                <td
                  key={`pmc-initial-${variation.id}`}
                  className="p-2 text-gray-400 text-sm min-w-[12.5rem]"
                >
                  Carregando...
                </td>
              ))}
            </tr>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-sm min-w-[12.5rem]">
                Preço de Fábrica
              </th>
              {variations.map((variation) => (
                <td
                  key={`pf-initial-${variation.id}`}
                  className="p-2 text-gray-400 text-sm min-w-[12.5rem]"
                >
                  Carregando...
                </td>
              ))}
            </tr>
          </>
        )}
    </>
  );
}

export default ProductMainVariantPriceTable;
