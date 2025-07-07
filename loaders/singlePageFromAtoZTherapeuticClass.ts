import { Secret } from "apps/website/loaders/secret.ts";
import { removeAccents } from "../sdk/format.ts";
import type {
  ListingFromAtoZ,
  ListingFromAtoZitem,
} from "../commerce/types.ts";

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
    const response = await fetch(url, {
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

    const filteredItem = data?.items?.filter(
      (therapeuticClass: ListingFromAtoZitem) => {
        const label = removeAccents(paramsVowel.toLowerCase()) || "";
        const therapeuticClassName = removeAccents(
          therapeuticClass.therapeuticClassName?.toLowerCase() || "",
        );

        if (label === "0-9") {
          // Cenário 1: label é "0-9", traz todos os nomes que começam com números
          return /^\d/.test(therapeuticClassName);
        } else {
          // Cenário 2: verifica se começa com a mesma string do label
          return therapeuticClassName.startsWith(label);
        }
      },
    );

    const page = Number(urlParams.searchParams.get("pagina")) ?? 1;

    const nextPage = new URLSearchParams(urlParams.searchParams);
    const previousPage = new URLSearchParams(urlParams.searchParams);

    const hasNextPage = Boolean(
      (filteredItem.length ?? 0) / 40 >=
        (Math.floor(filteredItem.length / 40) ?? 0),
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

    const totalPages = Math.ceil(filteredItem.length / 40);
    return {
      items: filteredItem,
      paramsVowel,
      pageInfo: {
        records: filteredItem.length,
        nextPage: totalPages !== page && filteredItem.length > 40
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
