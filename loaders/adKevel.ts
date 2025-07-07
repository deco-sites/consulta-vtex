import { Secret } from "apps/website/loaders/secret.ts";
import { AdKevel } from "../commerce/types.ts";
export interface Placement {
  divName: string;
  networkId: number;
  siteId: number;
  adTypes: number[];
}

export interface Props {
  urlFetch: string;
  token: Secret;
  placements: Placement[];
  keywords: string[];
}

async function loader({
  urlFetch,
  placements,
  keywords = [],
}: Props): Promise<AdKevel | null> {
  //   const tokenValue = token.get?.();

  const response = await fetch(urlFetch, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Adzerk-ApiKey": `058EC6C8a72CBa4798aB792a27D7116B5277`,
    },
    body: JSON.stringify({
      placements,
      keywords,
    }),
  });

  const data = await response.json();

  if (!data?.decisions.bannerHome) {
    return null;
  }

  return data.decisions.bannerHome;
}

export default loader;
