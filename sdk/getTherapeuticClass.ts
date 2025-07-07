export const getTherapeuticClass = async (queryTherapeuticClass: string) => {
  const urlPromisse1 =
    `https://auxiliarapi.consultaremedios.com.br/TherapeuticClass/_slug/${queryTherapeuticClass}-root`; // Primeira URL
  const urlPromisse2 =
    `https://auxiliarapi.consultaremedios.com.br/TherapeuticClass/_slug/${queryTherapeuticClass}`; // Segunda URL (sem o sufixo '-root')

  const headersTherapeuticClass = {
    Authorization:
      "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
    "Content-Type": "application/json",
  };

  try {
    let response = await fetch(urlPromisse1, {
      method: "GET",
      headers: headersTherapeuticClass,
    });

    if (!response.ok) {
      response = await fetch(urlPromisse2, {
        method: "GET",
        headers: headersTherapeuticClass,
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
    }

    const data = await response.json();

    return data;
  } catch (_error) {
    return null;
  }
};
