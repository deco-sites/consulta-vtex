import { Secret } from "apps/website/loaders/secret.ts";

import type { ListingFromAtoZ } from "../commerce/types.ts";
export interface Props {
  token: Secret;
  url: string;
}

const loader = async (
  { url }: Props,
  req: Request,
): Promise<ListingFromAtoZ> => {
  // const tokenPromisse = token.get?.() ?? "";
  const urlParams = new URL(req.url).pathname === "/live/invoke"
    ? new URL(req.headers.get("referer") || req.url)
    : new URL(req.url);

  const paramsVowel = urlParams.pathname.substring(
    urlParams.pathname.lastIndexOf("/") + 1,
  );

  // console.log(req);
  try {
    const response = await fetch(`${url}&titleStartsWith=${paramsVowel}`, {
      headers: {
        Authorization:
          "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // const filteredItem = data?.items?.filter(
    //   (medicine: ListingFromAtoZitem) => {
    //     const label = removeAccents(paramsVowel.toLowerCase()) || "";
    //     const medicineName = removeAccents(medicine.title?.toLowerCase() || "");

    //     if (label === "0-9") {
    //       // Cenário 1: label é "0-9", traz todos os nomes que começam com números
    //       return /^\d/.test(medicineName);
    //     } else {
    //       // Cenário 2: verifica se começa com a mesma string do label
    //       return medicineName.startsWith(label);
    //     }
    //   }
    // );

    const page = Number(urlParams.searchParams.get("pagina")) ?? 1;

    const nextPage = new URLSearchParams(urlParams.searchParams);
    const previousPage = new URLSearchParams(urlParams.searchParams);

    const hasNextPage = Boolean(
      (data?.items?.length ?? 0) / 40 >=
        (Math.floor(data?.items?.length / 40) ?? 0),
    );

    const hasPreviousPage = page > 1;

    const pageOffset = 1;

    if (hasNextPage) {
      nextPage.set(
        "pagina",
        (page == 0 ? page + pageOffset + 1 : page + 1).toString(),
      );
    }

    if (hasPreviousPage) {
      previousPage.set("pagina", (page - 1).toString());
    }

    const totalPages = Math.ceil(data?.items?.length / 40);

    return {
      items: data?.items,
      paramsVowel,
      pageInfo: {
        records: data?.items?.length,
        nextPage: totalPages !== page && data?.items?.length > 40
          ? `?${nextPage}`
          : undefined,
        previousPage: hasPreviousPage ? `?${previousPage}` : undefined,
        currentPage: page === 0 ? 1 : page,
        recordPerPage: 40,
        totalPages: totalPages,
      },
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export default loader;
