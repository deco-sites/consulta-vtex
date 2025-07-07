// Arquivo: loaders/ContentProductPage.ts
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import {
  Product,
  ProductVariation,
  Substance,
} from "../commerce/ContentTypes.ts";

// Constantes
const DEFAULT_STATE = "SP";
const AUTH_TOKEN =
  "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360";
const API_BASE_URL = "https://auxiliarapi.consultaremedios.com.br";

// Função que mapeia o CEP para a sigla do estado
export function getStateFromCEP(cep: string): string {
  // Remover caracteres não numéricos
  const numericCEP = cep.replace(/\D/g, "");

  // CEP inválido - retornar SP como fallback (alterado de BA para SP)
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

  // CEP não mapeado - retornar SP como fallback (alterado de BA para SP)
  return DEFAULT_STATE;
}

// Função para obter a capital do estado
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

// Função para obter preços baseados no estado
async function getPricesByState(
  variationSlug: string,
  stateCode: string,
  authToken: string,
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

// Função para obter todas as variações de um produto
async function getProductWithVariations(
  productSlug: string,
  authToken: string,
): Promise<Product | null> {
  try {
    // URL do endpoint para buscar o produto completo com variações
    const url = `${API_BASE_URL}/product/_slug/${productSlug}`;

    // Fazendo a requisição para a API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    // Obter os dados do produto
    const productData = (await response.json()) as Product;
    return productData;
  } catch (_error) {
    return null;
  }
}

export interface Props {
  slug?: RequestURLParam;
  product: RequestURLParam;
}

export async function ContentProductPage(
  props: Props,
  req: Request,
): Promise<ProductVariation | null> {
  const { product, slug } = props;

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
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`,
      );
    }

    // Obtém os dados da variação do produto
    const productData = (await response.json()) as ProductVariation;

    // Buscar o produto completo com todas as variações
    const fullProductData = await getProductWithVariations(product, AUTH_TOKEN);

    // Se conseguiu buscar o produto completo, adiciona à variação atual
    if (fullProductData) {
      // @ts-ignore - Adicionando o produto completo à resposta
      productData.product = fullProductData;
    }

    // Obtém o estado do usuário a partir do CEP nos cookies
    let userState = DEFAULT_STATE; // Estado padrão: São Paulo
    let userCep = "";

    // Tenta extrair o cookie de CEP da requisição
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cepMatch = cookieHeader.match(/user_cep=([^;]+)/);
      if (cepMatch && cepMatch[1]) {
        userCep = decodeURIComponent(cepMatch[1]);
        userState = getStateFromCEP(userCep);
      }
    }

    // Busca os preços para o estado do usuário
    const fullSlug = `${product}/${cleanSlug}`;
    const prices = await getPricesByState(fullSlug, userState, AUTH_TOKEN);

    // Adiciona os dados personalizados ao objeto de resposta
    // @ts-ignore - Adicionando propriedades personalizadas
    productData.userState = userState;
    // @ts-ignore - Adicionando propriedades personalizadas
    productData.userCep = userCep;

    if (prices.pmc !== undefined) {
      // @ts-ignore - Adicionando propriedades personalizadas
      productData.userStatePMC = prices.pmc;
    } else {
      // Se não encontrou preço específico, tenta usar o preço para SP (priceTaxId = 11)
      const defaultPMC = productData.customerMaximumPrice?.find(
        (p) => p.priceTaxId === 11,
      )?.price;

      if (defaultPMC) {
        // @ts-ignore - Adicionando propriedades personalizadas
        productData.userStatePMC = defaultPMC;
      }
    }

    if (prices.pf !== undefined) {
      // @ts-ignore - Adicionando propriedades personalizadas
      productData.userStatePF = prices.pf;
    } else {
      // Se não encontrou preço específico, tenta usar o preço para SP (priceTaxId = 11)
      const defaultPF = productData.factoryPrice?.find(
        (p) => p.priceTaxId === 11,
      )?.price;

      if (defaultPF) {
        // @ts-ignore - Adicionando propriedades personalizadas
        productData.userStatePF = defaultPF;
      }
    }

    // Verifica se conseguiu obter os preços, se não, tenta usar os preços padrão
    // @ts-ignore - Acessando propriedades personalizadas
    if (
      productData.userStatePMC === undefined &&
      productData.customerMaximumPrice?.length > 0
    ) {
      // @ts-ignore - Adicionando propriedades personalizadas
      productData.userStatePMC = productData.customerMaximumPrice[0].price;
    }

    // @ts-ignore - Acessando propriedades personalizadas
    if (
      productData.userStatePF === undefined &&
      productData.factoryPrice?.length > 0
    ) {
      // @ts-ignore - Adicionando propriedades personalizadas
      productData.userStatePF = productData.factoryPrice[0].price;
    }

    // Se tiver obtido o produto completo com variações, buscar também os preços das outras variações
    if (
      fullProductData &&
      fullProductData.variation &&
      fullProductData.variation.length > 0
    ) {
      // Para cada variação, buscar os preços específicos do estado do usuário
      for (const variation of fullProductData.variation) {
        // Pular a variação atual que já buscamos
        if (variation.id === productData.id) continue;

        const variationSlug = `${product}/${variation.slug}`;
        const variationPrices = await getPricesByState(
          variationSlug,
          userState,
          AUTH_TOKEN,
        );

        if (variationPrices.pmc !== undefined) {
          // @ts-ignore - Adicionando propriedades personalizadas
          variation.userStatePMC = variationPrices.pmc;
        }

        if (variationPrices.pf !== undefined) {
          // @ts-ignore - Adicionando propriedades personalizadas
          variation.userStatePF = variationPrices.pf;
        }
      }
    }

    // Busca os dados da substância se houver um substanceId
    if (productData?.substanceId) {
      const costumerTitles: { [key: string]: boolean } = {
        "Como usar o {name}?": false,
        "{name}, para o que é indicado e para o que serve?": false,
        "Quais as contraindicações do {name}?": false,
        "Qual a composição do {name}?": false,
        "Quais cuidados devo ter ao usar o {name}?": false,
        "Como devo armazenar o {name}?": false,
        "Quais as reações adversas e os efeitos colaterais do {name}?": false,
        "Superdose: o que acontece se tomar uma dose do {name} maior do que a recomendada?":
          false,
        "Dizeres Legais do {name}": false,
        "Interação medicamentosa: quais os efeitos de tomar {name} com outros remédios?":
          false,
        "Como o {name} funciona?": false,
        "Apresentações do {name}": false,
        "O que devo fazer quando me esquecer de usar o {name}?": false,
        "Interação Alimentícia: posso usar o {name} com alimentos?": false,
        "Riscos do {name}?": false,
      };

      let missingAttributes = false;

      for (let key in costumerTitles) {
        const findCustomerTitle = productData.product.productAttribute.find(
          (e) => e.attribute.customerTitle == key,
        );
        if (findCustomerTitle) {
          costumerTitles[key] = true;
        }

        if (!costumerTitles[key]) {
          missingAttributes = true;
        }
      }

      try {
        // URL para buscar a substância
        const substanceUrl =
          `${API_BASE_URL}/substance/${productData.substanceId}`;

        // Requisição da substância
        const substanceResponse = await fetch(substanceUrl, {
          method: "GET",
          headers: {
            Authorization: AUTH_TOKEN,
            "Content-Type": "application/json",
          },
        });

        if (substanceResponse.ok) {
          const substanceData = (await substanceResponse.json()) as Substance;

          if (missingAttributes) {
            for (let key in costumerTitles) {
              if (!costumerTitles[key]) {
                const findCustomerTitleSubstance = substanceData
                  ?.substanceAttribute?.find(
                    (e) => e.attribute.customerTitle == key,
                  );
                findCustomerTitleSubstance &&
                  productData.product.productAttribute.push(
                    findCustomerTitleSubstance,
                  );
              }
            }
          }

          return {
            ...productData,
            substance: {
              ...productData.substance,
              // Garantir que os dados da substância tenham prioridade,
              // mas manter dados originais se não estiverem na resposta da API
              ...substanceData,
              // Garantir que as doenças sejam incluídas
              disease: substanceData.disease || [],
            },
          };
        } else {
          // Retorna apenas os dados do produto se não conseguir buscar a substância
          return productData;
        }
      } catch (substanceError) {
        console.warn("Erro ao buscar dados da substância:", substanceError);
        // Retorna apenas os dados do produto se houver erro na busca da substância
        return productData;
      }
    }

    // Retorna apenas os dados do produto se não houver substanceId
    return productData;
  } catch (_error) {
    return null;
  }
}

export default ContentProductPage;
