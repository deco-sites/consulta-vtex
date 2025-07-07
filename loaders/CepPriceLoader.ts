// Constantes
const DEFAULT_STATE = "SP";
const AUTH_TOKEN =
  "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360";
const API_BASE_URL = "https://auxiliarapi.consultaremedios.com.br";

// Interface para os preços retornados
export interface PriceData {
  pmc?: number;
  pf?: number;
  state: string;
  cep?: string;
}

// Interface para os parâmetros de entrada do loader
export interface Props {
  product: string;
  slug?: string;
  cep?: string;
}

/**
 * Função que mapeia o CEP para a sigla do estado
 * @param cep CEP a ser convertido em sigla de estado
 * @returns Sigla do estado correspondente ao CEP
 */
export function getStateFromCEP(cep: string): string {
  // Remover caracteres não numéricos
  const numericCEP = cep.replace(/\D/g, "");

  // CEP inválido - retornar SP como fallback
  if (numericCEP.length !== 8) return DEFAULT_STATE;

  // Conversão do CEP para número para facilitar as comparações
  const cepNumber = parseInt(numericCEP, 10);

  // Mapeamento de faixas de CEP por estado
  if (cepNumber >= 1000000 && cepNumber <= 19999999) return "SP";
  if (cepNumber >= 20000000 && cepNumber <= 28999999) return "RJ";
  if (cepNumber >= 29000000 && cepNumber <= 29999999) return "ES";
  if (cepNumber >= 30000000 && cepNumber <= 39999999) return "MG";
  if (cepNumber >= 40000000 && cepNumber <= 48999999) return "BA";
  if (cepNumber >= 49000000 && cepNumber <= 49999999) return "SE";
  if (cepNumber >= 50000000 && cepNumber <= 56999999) return "PE";
  if (cepNumber >= 57000000 && cepNumber <= 57999999) return "AL";
  if (cepNumber >= 58000000 && cepNumber <= 58999999) return "PB";
  if (cepNumber >= 59000000 && cepNumber <= 59999999) return "RN";
  if (cepNumber >= 60000000 && cepNumber <= 63999999) return "CE";
  if (cepNumber >= 64000000 && cepNumber <= 64999999) return "PI";
  if (cepNumber >= 65000000 && cepNumber <= 65999999) return "MA";
  if (cepNumber >= 66000000 && cepNumber <= 68899999) return "PA";
  if (cepNumber >= 68900000 && cepNumber <= 68999999) return "AP";
  if (cepNumber >= 69000000 && cepNumber <= 69299999) return "AM";
  if (cepNumber >= 69300000 && cepNumber <= 69399999) return "RR";
  if (cepNumber >= 69400000 && cepNumber <= 69899999) return "AM";
  if (cepNumber >= 69900000 && cepNumber <= 69999999) return "AC";
  if (cepNumber >= 70000000 && cepNumber <= 73699999) return "DF";
  if (cepNumber >= 73700000 && cepNumber <= 76799999) return "GO";
  if (cepNumber >= 76800000 && cepNumber <= 76999999) return "RO";
  if (cepNumber >= 77000000 && cepNumber <= 77999999) return "TO";
  if (cepNumber >= 78000000 && cepNumber <= 78899999) return "MT";
  if (cepNumber >= 79000000 && cepNumber <= 79999999) return "MS";
  if (cepNumber >= 80000000 && cepNumber <= 87999999) return "PR";
  if (cepNumber >= 88000000 && cepNumber <= 89999999) return "SC";
  if (cepNumber >= 90000000 && cepNumber <= 99999999) return "RS";

  // CEP não mapeado - retornar SP como fallback
  return DEFAULT_STATE;
}

/**
 * Função para obter a capital do estado
 * @param stateCode Sigla do estado
 * @returns Nome da capital do estado
 */
function getStateCapital(stateCode: string): string {
  const capitals: Record<string, string> = {
    AC: "Rio Branco",
    AL: "Maceió",
    AP: "Macapá",
    AM: "Manaus",
    BA: "Salvador",
    CE: "Fortaleza",
    DF: "Brasília",
    ES: "Vitória",
    GO: "Goiânia",
    MA: "São Luís",
    MT: "Cuiabá",
    MS: "Campo Grande",
    MG: "Belo Horizonte",
    PA: "Belém",
    PB: "João Pessoa",
    PR: "Curitiba",
    PE: "Recife",
    PI: "Teresina",
    RJ: "Rio de Janeiro",
    RN: "Natal",
    RS: "Porto Alegre",
    RO: "Porto Velho",
    RR: "Boa Vista",
    SC: "Florianópolis",
    SP: "São Paulo",
    SE: "Aracaju",
    TO: "Palmas",
  };

  return capitals[stateCode] || "São Paulo"; // Fallback para São Paulo
}

/**
 * Função para obter preços baseados no estado
 * @param variationSlug Slug da variação do produto
 * @param stateCode Sigla do estado
 * @param authToken Token de autenticação para a API
 * @returns Objeto com preços PMC e PF
 */
async function getPricesByState(
  variationSlug: string,
  stateCode: string,
  authToken: string = AUTH_TOKEN,
): Promise<{ pmc?: number; pf?: number }> {
  try {
    // URL do endpoint para cálculo de preços
    const url = `${API_BASE_URL}/pmcpf`;

    // Cidade capital do estado
    const cityName = getStateCapital(stateCode);

    // Corpo da requisição
    const body = {
      variationSlugList: [variationSlug],
      customerStateCode: stateCode,
      customerCityName: cityName,
    };

    // Fazendo a requisição para a API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {};
    }

    // Obter os dados de preço
    const priceData = await response.json();

    // Verificar se a resposta contém os dados necessários
    if (priceData && priceData.length > 0) {
      return {
        pmc: priceData[0].customerMaximumPrice,
        pf: priceData[0].factoryPrice,
      };
    }

    return {};
  } catch (_error) {
    return {};
  }
}

/**
 * Loader principal para o Deco - busca preços baseados no CEP
 * @param props Objeto com produto, slug e CEP
 * @param req Objeto de requisição para extrair o CEP dos cookies, se não fornecido
 * @returns Objeto com preços atualizados e informações de estado
 */
export async function CepPriceLoader(
  props: Props,
  req: Request,
): Promise<PriceData> {
  try {
    const { product, slug, cep: propCep } = props;

    // Se não tiver produto ou slug, não podemos buscar os preços
    if (!product || !slug) {
      return { state: DEFAULT_STATE };
    }

    // Limpa o slug se necessário (remove o "/p" final)
    const cleanSlug = typeof slug === "string" && slug.endsWith("/p")
      ? slug.slice(0, -2)
      : slug;

    // Tenta obter o CEP dos props ou dos cookies da requisição
    let cep = propCep || "";

    if (!cep && req) {
      // Extrai o CEP dos cookies, se disponível
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cepMatch = cookieHeader.match(/user_cep=([^;]+)/);
        if (cepMatch && cepMatch[1]) {
          cep = decodeURIComponent(cepMatch[1]);
        }
      }
    }

    // Se não tiver CEP, retorna estado padrão
    if (!cep) {
      return { state: DEFAULT_STATE };
    }

    // Determina o estado a partir do CEP
    const state = getStateFromCEP(cep);

    // Formata o slug completo da variação
    const fullSlug = `${product}/${cleanSlug}`;

    // Busca os preços para o estado
    const prices = await getPricesByState(fullSlug, state);

    // Retorna os dados completos
    return {
      pmc: prices.pmc,
      pf: prices.pf,
      state,
      cep,
    };
  } catch (error) {
    console.error("[Debug CepPriceLoader] Erro na busca de preços:", error);
    return { state: DEFAULT_STATE };
  }
}

export default CepPriceLoader;
