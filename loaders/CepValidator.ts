/**
 * Loader para validar CEP através da API ViaCEP na Deco
 */

export interface CepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface CepValidatorResult {
  isValid: boolean;
  message: string;
  data?: CepAddress;
}

export interface Props {
  cep: string;
}

/**
 * Valida se um CEP existe através da API ViaCEP
 * @param props.cep CEP para validar (formato: 00000-000 ou 00000000)
 * @returns Objeto contendo resultado da validação e dados do endereço se válido
 */
export default async function CepValidator({
  cep,
}: Props): Promise<CepValidatorResult> {
  // const apiKey = "4a2628ecd0414a5493a1ac4e8c7a5fe0";
  // Remove caracteres não numéricos do CEP
  const cleanCep = cep.replace(/\D/g, "");

  // Verifica se o CEP tem 8 dígitos
  if (cleanCep.length !== 8) {
    return {
      isValid: false,
      message: "CEP deve conter 8 dígitos numéricos.",
    };
  }

  // console.log(cleanCep);
  // const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
  //   cleanCep
  // )}&key=${apiKey}&language=pt&countrycode=br`;

  // const responseTest = await fetch(url);

  // if (!responseTest.ok) {
  //   throw new Error(`Erro ao buscar coordenadas: ${responseTest.status}`);
  // }

  // const data = await responseTest.json();
  // console.log(data);
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      return {
        isValid: false,
        message: `Erro ao consultar o CEP: ${response.status}`,
      };
    }

    const data = await response.json();

    // A API do ViaCEP retorna { erro: true } quando o CEP não existe
    if (data.erro) {
      return {
        isValid: false,
        message: "CEP não encontrado na base dos Correios.",
      };
    }

    // CEP válido, retorna os dados
    return {
      isValid: true,
      message: "CEP válido.",
      data: data,
    };
  } catch (error) {
    console.error("Erro ao consultar o CEP:", error);
    return {
      isValid: false,
      message: "Erro ao consultar o CEP. Tente novamente mais tarde.",
    };
  }
}
