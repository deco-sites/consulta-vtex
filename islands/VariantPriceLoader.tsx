// Arquivo: islands/VariantPriceLoader.tsx
import { useSignal } from "@preact/signals";
import { useUI } from "../sdk/useUI.ts";
import { useEffect } from "preact/hooks";
import { invoke } from "../runtime.ts";
import { ProductVariation } from "../commerce/ContentTypes.ts";

// Interface para os dados de preço de uma variação
export interface VariationPriceData {
  variationId: number;
  state: string;
  pmc?: number;
  pf?: number;
  cep?: string;
}

export interface VariantPriceLoaderProps {
  productSlug: string;
  variations: ProductVariation[];
  onPriceUpdate?: (priceData: VariationPriceData[]) => void;
}

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

/**
 * Componente que carrega e gerencia os preços baseados no CEP para múltiplas variações de produto
 */
export function VariantPriceLoader({
  productSlug,
  variations,
  onPriceUpdate,
}: VariantPriceLoaderProps) {
  // Estado local e UI
  const { cepDrawer } = useUI();
  const cep = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);
  const loaded = useSignal<boolean>(false);
  const dataFetched = useSignal<boolean>(false);

  // Função para buscar dados atualizados usando o CepPriceLoader via invoke
  async function fetchUpdatedPrices() {
    // Evita refazer a busca se já estiver carregando ou se já foi carregado com este CEP
    if (isLoading.value) {
      return;
    }

    if (!productSlug || !variations.length || !cep.value) {
      return;
    }

    try {
      isLoading.value = true;
      // Array para armazenar os preços de todas as variações
      const allPriceData: VariationPriceData[] = [];

      // Buscar preços para cada variação
      for (const variation of variations) {
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
            "[VariantPriceLoader] Erro ao buscar preço para variação",
            variation.id,
            error,
          );
          // Se falhar uma variação, ainda adicionamos com dados padrão
          allPriceData.push({
            variationId: variation.id,
            state: "SP",
            cep: cep.value,
          });
        }
      }

      // Notificar componente pai sobre os novos preços
      if (onPriceUpdate) {
        console.log(
          "[VariantPriceLoader] Notificando componente pai sobre preços atualizados",
        );
        onPriceUpdate(allPriceData);
      } else {
        console.warn(
          "[VariantPriceLoader] Nenhum callback onPriceUpdate fornecido",
        );
      }

      loaded.value = true;
      dataFetched.value = true;
    } catch (error) {
      console.error("[VariantPriceLoader] Erro ao buscar preços:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Efeito para obter o CEP e iniciar a busca de preços
  useEffect(() => {
    // Obtém o CEP do drawer ou dos cookies
    if (typeof window !== "undefined") {
      const cookieCep = getCepFromCookies();

      const newCep = cepDrawer.value || cookieCep || "01153000"; // CEP padrão como fallback

      // Atualiza o CEP no state local apenas se for diferente
      if (newCep && newCep !== cep.value) {
        cep.value = newCep;
        dataFetched.value = false; // Resetar flag para buscar novos dados
      }

      // Se tiver CEP e não tiver buscado dados ainda, busca os preços
      if (cep.value && !dataFetched.value) {
        fetchUpdatedPrices();
      }
    }
  }, [cepDrawer.value, productSlug, variations, cep.value, dataFetched.value]);

  // Renderizar um elemento div invisível com informações de debug
  return (
    <div
      style={{ display: "none" }}
      data-cep={cep.value}
      data-loaded={loaded.value}
      data-loading={isLoading.value}
    >
      {/* Elemento invisível apenas para debug */}
    </div>
  );
}

export default VariantPriceLoader;
