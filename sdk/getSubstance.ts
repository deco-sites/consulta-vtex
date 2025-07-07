export const getSubstance = async (querySubstance: string) => {
  const urlPromisse =
    `https://auxiliarapi.consultaremedios.com.br/Substance/_slug/${querySubstance}`;
  const headersSubstance = {
    Authorization:
      "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
    "Content-Type": "application/json",
  };
  try {
    const response = await fetch(urlPromisse, {
      method: "GET",
      headers: headersSubstance,
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (_error) {
    return null;
  }
};
