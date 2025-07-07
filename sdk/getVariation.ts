// Constantes para a API
const API_BASE_URL = "https://auxiliarapi.consultaremedios.com.br";
const AUTH_TOKEN =
  "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360";

// Importar RequestURLParam do caminho correto
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";

/**
 * Obtém os dados de uma variação de produto pelo produto e slug
 * @param product - Nome do produto (ex: "anesfent")
 * @param slug - Slug da variação (ex: "50mcg-ml-caixa-com-50-ampolas-com-10ml-de-solucao-de-uso-intravenoso")
 * @returns Os dados da variação do produto ou null em caso de erro
 */
export async function getVariation(
  product: RequestURLParam,
  slug: RequestURLParam,
) {
  // Se não tiver slug, não podemos buscar a variação específica
  if (!slug) {
    console.error("Slug não fornecido para busca de variação");
    return null;
  }

  try {
    // Remove o "/p" final do slug se existir
    const cleanSlug = slug.endsWith("/p") ? slug.slice(0, -2) : slug;
    const url = `${API_BASE_URL}/variation/_slug/${product}/${cleanSlug}`;

    // Fazendo a requisição para a API com fetch nativo
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (_error) {
    return null;
  }
}
