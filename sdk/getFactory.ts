export const getFactory = async (slug: string) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Factory/_slug/${slug}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();
    const newData = data?.length === 0 ? null : data;
    return newData;
  } catch (_error) {
    return null;
  }
};
