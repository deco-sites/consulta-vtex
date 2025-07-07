import { draftOrderCalculate } from "apps/shopify/utils/admin/queries.ts";

export const getCategory = async (slug: string) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Category?slug=${slug}`,
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

export const getCategoryThumbs = async (names: string[] | null) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Category/_name`,
      {
        method: "POST",
        headers: {
          Authorization:
            "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameList: names,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (_error) {
    return null;
  }
};

export const getTerms = async (slug: string) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Term/${slug}`,
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

    const newData = data ? data : null;

    if (newData["relatedTerm"]?.length > 0) {
      const responseTermsId = await getTermsPerId(data["relatedTerm"]);
      if (responseTermsId.length) {
        newData["relatedTermTitles"] = responseTermsId;
      }
    }
    // console.log("depois", newData);

    return newData;
  } catch (_error) {
    return null;
  }
};

export const getTermsPerId = async (ids: number[] | null) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Term/_id`,
      {
        method: "POST",
        headers: {
          Authorization:
            "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: ids,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();
    const newData = data?.length === 0 ? null : data;
    return newData?.map((item: { termValue: string; title: string }) => ({
      termValue: item.termValue,
      title: item.title,
    }));
  } catch (_error) {
    return null;
  }
};

export const getDisease = async (slug: string) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Disease/_slug/${slug}`,
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
    return data;
  } catch (_error) {
    return null;
  }
};

export const getCategoryForSlus = async (slugs: string[] | null) => {
  try {
    const response = await fetch(
      `https://auxiliarapi.consultaremedios.com.br/Category/_slug`,
      {
        method: "POST",
        headers: {
          Authorization:
            "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slugList: slugs,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (_error) {
    return null;
  }
};
