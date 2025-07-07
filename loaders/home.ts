import { HomePage } from "../commerce/pages/home.ts";
import type { AppContext } from "apps/wake/mod.ts";
import { Home } from "../utils/graphql/pageQueries.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import { fetchSafe } from "apps/utils/fetch.ts";
import {
  GetHomeQueryVariables,
  HomePageQuery,
  ProductFragment,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { toProduct } from "../utils/transform.ts";

export interface Props {
  /**
   * @title Count
   * @description Number of products to return
   * @maximum 50
   * @default 16
   */
  first: number;
  sortDirection: "ASC" | "DESC";
  sortKey:
    | "DISCOUNT"
    | "NAME"
    | "PRICE"
    | "RANDOM"
    | "RELEASE_DATE"
    | "SALES"
    | "STOCK";
}

const loader = async (
  props: Props,
  req: Request,
  _ctx: AppContext,
): Promise<HomePage | null> => {
  const url = new URL(req.url);
  const headers = parseHeaders(req.headers);

  const token = "tcs_consu_4d654fa8c7e44e159c12bc5cabf32585";

  const storefront = createGraphqlClient({
    endpoint: "https://storefront-api.fbits.net/graphql",
    headers: new Headers({ "TCS-Access-Token": token }),
    fetcher: fetchSafe,
  });

  const data = await storefront.query<HomePageQuery, GetHomeQueryVariables>(
    {
      variables: { ...props },
      ...Home,
    },
    {
      headers,
    },
  );

  const anticoagulante = data?.anticoagulante?.nodes;
  const colageno = data?.colageno?.nodes;
  const descongestionanteNasal = data?.descongestionanteNasal?.nodes;
  const diabetes = data?.diabetes?.nodes;
  const disfuncaoEretil = data?.disfuncaoEretil?.nodes;
  const leiteInfantil = data?.leiteInfantil?.nodes;
  const medicamentosAltoCusto = data?.medicamentosAltoCusto?.nodes;
  const pararDeFumar = data?.pararDeFumar?.nodes;

  return (
    {
      anticoagulante: anticoagulante
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      colageno: colageno
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      descongestionanteNasal: descongestionanteNasal
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      diabetes: diabetes
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      disfuncaoEretil: disfuncaoEretil
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      leiteInfantil: leiteInfantil
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      medicamentosAltoCusto: medicamentosAltoCusto
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
      pararDeFumar: pararDeFumar
        ?.filter((node): node is ProductFragment => Boolean(node))
        .map((node) => {
          return toProduct(node, { base: url });
        }),
    } || null
  );
};

export const cache = {
  maxAge: 60 * 60 * 24, // 1 day
};

export const cacheKey = (_props: Props, req: Request, _ctx: AppContext) => {
  const url = new URL(req.url);

  const params = new URLSearchParams([["slug", "home" ?? ""]]);

  url.search = params.toString();

  return url.href;
};

export default loader;
