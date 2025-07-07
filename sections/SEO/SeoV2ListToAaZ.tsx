import { Props as SeoProps } from "apps/website/components/Seo.tsx";
import Seo from "../../components/ui/Seo.tsx";
import type { ListingFromAtoZ } from "../../commerce/types.ts";
import {
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";
import { AppContext } from "apps/website/mod.ts";

type Props = Pick<SeoProps, "title" | "description" | "type" | "canonical"> & {
  /** @title Descrição complementar */
  descriptionTwo?: string;
  jsonLD?: ListingFromAtoZ;
};
/** @title Seo List to a Z */
export function loader(props: Props, req: Request, ctx: AppContext) {
  const {
    titleTemplate = "",
    descriptionTemplate = "",
    title: appTitle = "",
    description: appDescription = "",
    ...seoSiteProps
  } = ctx.seo ?? {};
  const {
    title: _title,
    description: _description,
    canonical,
    ...seoProps
  } = props;
  const title = renderTemplateString(
    (titleTemplate ?? "").trim().length === 0 ? "%s" : titleTemplate,
    _title ?? appTitle,
  );
  const description = renderTemplateString(
    (descriptionTemplate ?? "").trim().length === 0
      ? "%s"
      : descriptionTemplate,
    _description ?? appDescription,
  );

  const url = new URL(req.url).pathname === "/live/invoke"
    ? new URL(req.headers.get("referer") || req.url)
    : new URL(req.url);

  const page = url.searchParams.get("pagina") || url.searchParams.get("pagina");

  const newCanonical = canonical || (page && Number(page ?? 0) > 1)
    ? `${url.origin}${url.pathname}?pagina=${page}`
    : `${url.origin}${url.pathname}`;

  const pageParam = url.searchParams.get("pagina");

  const isValidPage = pageParam && /^\d+$/.test(pageParam);

  const paramsVowel = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);

  return {
    ...seoSiteProps,
    ...seoProps,
    title: `${title} ${paramsVowel?.toLocaleUpperCase()} ${
      isValidPage ? `- Página ${pageParam}` : ""
    } | CR`,
    description: `${description} ${paramsVowel?.toLocaleUpperCase()}${
      props.descriptionTwo ? props.descriptionTwo : ""
    } `,
    canonical: newCanonical,
    noIndexing: false,
    // noIndexing: true,
    pageInfo: props.jsonLD?.pageInfo,
    href: {
      origin: url.origin,
      pathname: url.pathname,
    },
  };
}

function Section(props: Props): SEOSection {
  return <Seo {...props} />;
}

export { default as Preview } from "apps/website/components/_seo/Preview.tsx";

export default Section;
