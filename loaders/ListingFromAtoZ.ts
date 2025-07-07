import { Secret } from "apps/website/loaders/secret.ts";

export interface ListingFromAtoZitem {
  id: number;
  statusId: number;
  therapeuticClassName?: string;
  factoryName?: string;
  customerTitle: string | null;
  slug: string;
  description: string;
  code: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  titleH1: string | null;
  created: string;
  updated: string;
  legacyId: string;
  diseaseName?: string;
  brandName?: string;
  substanceName?: string;
  title?: string;
  commercialName?: string;
}

export interface ListingFromAtoZresponse {
  take: number;
  skip: number;
  totalCount: number;
  items: ListingFromAtoZitem[];
}

export interface Props {
  token: Secret;
  url: string;
}

const loader = async (
  { url }: Props,
  _req: Request,
): Promise<ListingFromAtoZresponse> => {
  // const tokenPromisse = token.get?.() ?? "";

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

    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

export default loader;
