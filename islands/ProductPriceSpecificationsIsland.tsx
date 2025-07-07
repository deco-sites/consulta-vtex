// Arquivo: islands/ProductPriceSpecificationsIsland.tsx
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { useUI } from "../sdk/useUI.ts";
import { invoke } from "../runtime.ts";

interface PriceSpecificationsIslandProps {
  productSlug: string;
  variationSlug: string;
}

/**
 * Componente Island para exibir especificações de preço baseado no CEP do usuário
 */
export function ProductPriceSpecificationsIsland({
  productSlug,
  variationSlug,
}: PriceSpecificationsIslandProps) {
  // Estado local e UI
  const { cepDrawer, pmcValue } = useUI();
  const cep = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);
  const userState = useSignal<string>("SP");
  const pmcPrice = useSignal<number | undefined>(undefined);
  const pfPrice = useSignal<number | undefined>(undefined);
  const isDataLoaded = useSignal<boolean>(false);

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
    if (!productSlug || !variationSlug || !cep.value) {
      return;
    }

    try {
      isLoading.value = true;

      const processedVariationSlug = processVariationSlug(
        productSlug,
        variationSlug,
      );

      // Chamar o CepPriceLoader via invoke com o slug processado
      const priceData = await invoke.site.loaders.CepPriceLoader({
        product: productSlug,
        slug: processedVariationSlug,
        cep: cep.value,
      });

      // Atualizar os signals com os novos valores
      userState.value = priceData.state || "SP";
      pmcPrice.value = priceData.pmc;
      pfPrice.value = priceData.pf;

      pmcValue.value = pmcPrice.value ?? 0;

      isDataLoaded.value = true;
    } catch (error) {
      console.error(
        "[ProductPriceSpecificationsIsland] Erro ao buscar preços:",
        error,
      );
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

      // Atualiza o CEP no state local apenas se for diferente
      if (newCep && newCep !== cep.value) {
        cep.value = newCep;
        isDataLoaded.value = false; // Resetar flag para buscar novos dados
      }

      // Se tiver CEP e não tiver buscado dados ainda, busca os preços
      if (cep.value && !isDataLoaded.value) {
        fetchUpdatedPrices();
      }
    }
  }, [
    cepDrawer.value,
    productSlug,
    variationSlug,
    cep.value,
    isDataLoaded.value,
  ]);

  // Verificar se há preços válidos para exibir
  const hasPMCPrice = () =>
    pmcPrice.value !== undefined && pmcPrice.value !== null;
  const hasPFPrice = () =>
    pfPrice.value !== undefined && pfPrice.value !== null;
  const hasAnyValidPrice = () => hasPMCPrice() || hasPFPrice();

  // Formatar preço para exibição
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return "R$ -";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  // Se estiver carregando ou não tiver dados válidos, não renderiza
  if (isLoading.value && !isDataLoaded.value) {
    return null;
  }

  // Se não tiver preços válidos após o carregamento, não renderiza
  if (isDataLoaded.value && !hasAnyValidPrice()) {
    return null;
  }

  // Renderizar as linhas de preço
  return (
    <>
      {/* Preço Máximo ao Consumidor */}
      {hasPMCPrice() && (
        <tr className={isDataLoaded.value ? "" : "opacity-50"}>
          <td className="py-3 px-4 font-medium text-content w-1/2">
            Preço Máximo ao Consumidor
          </td>
          <td className="py-3 px-4 text-gray-800">
            PMC/{userState.value} {formatCurrency(pmcPrice.value)}
          </td>
        </tr>
      )}

      {/* Preço de Fábrica */}
      {hasPFPrice() && (
        <tr
          className={`${isDataLoaded.value ? "" : "opacity-50"} ${
            hasPMCPrice() ? "bg-[#e9ecef]" : "bg-white"
          }`}
        >
          <td className="py-3 px-4 font-medium text-content w-1/2">
            Preço de Fábrica
          </td>
          <td className="py-3 px-4 text-gray-800">
            PF/{userState.value} {formatCurrency(pfPrice.value)}
          </td>
        </tr>
      )}
    </>
  );
}

export default ProductPriceSpecificationsIsland;
