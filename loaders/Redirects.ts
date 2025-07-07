// import { Route } from "apps/website/flags/audience.ts";
import { AppContext } from "apps/website/mod.ts";
import { formatarTextoParaHref } from "../sdk/format.ts";
/**
 * @title Redirects
 */
export default async function Redirects(
  _props: unknown,
  req: Request,
  _ctx: AppContext,
) {
  // const allRedirects = await ctx.get<Route[]>({
  //   key: "getAllRedirects",
  //   func: () => getAllRedirects(ctx, req),
  //   __resolveType: "",
  // });

  const url = new URL(req.url).pathname === "/live/invoke"
    ? new URL(req.headers.get("referer") || req.url)
    : new URL(req.url);

  const urlPromisse =
    `https://auxiliarapi.consultaremedios.com.br/Redirect?originUrl=${url?.pathname}${url?.search}`;

  const headers = {
    Authorization:
      "CR83A91E954D01B307D2F46D37BF39CB9B5179350E2787F48FC72C7CBA6BC76360",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(urlPromisse, { method: "GET", headers });

    // if (!response.ok) {
    //   console.log("errror");
    // }

    const data = await response.json();

    if (data.length > 0) {
      const destinyUrl = data[0].destinyUrl;
      const urlPath = new URL(destinyUrl, url.origin);

      return urlPath?.pathname;
    }

    if (url?.pathname?.includes("busca")) {
      const terms = formatarTextoParaHref(url?.search?.replace("?termo=", ""));
      return `/b/${terms}`;
    }

    return null;
  } catch (_error) {
    return null;
  }
}
