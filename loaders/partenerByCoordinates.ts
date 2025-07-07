import { AppContext } from "../apps/site.ts";
import { parseHeaders } from "apps/wake/utils/parseHeaders.ts";
interface Props {
  latitude: number;
  longitude: number;
}

const loader = async (
  { latitude, longitude }: Props,
  req: Request,
  _ctx: AppContext,
) => {
  const query = `
    query ($latitude: Decimal!, $longitude: Decimal!) {
      partnerByCoordinates(input: {latitude: $latitude, longitude: $longitude}) {
        name
        partnerId
        portfolioId
        startDate
        partnerAccessToken
        origin
        logoUrl
      }
    }
  `;

  const headers = parseHeaders(req.headers);

  const response = await fetch("https://storefront-api.fbits.net/graphql", {
    method: "POST",
    headers: {
      "TCS-Access-Token": "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query, variables: { latitude, longitude } }),
  });

  if (!response.ok) throw new Error(`Erro na GraphQL: ${response.status}`);

  const data = await response.json();
  return data.data.partnerByCoordinates;
};

export default loader;
