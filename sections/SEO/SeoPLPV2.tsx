import Seo from "../../components/ui/Seo.tsx";
import {
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";
import { ProductListingPage } from "../../commerce/types.ts";
import { canonicalFromBreadcrumblist } from "apps/commerce/utils/canonical.ts";
import { AppContext } from "apps/commerce/mod.ts";

export interface ConfigJsonLD {
  /**
   * @title Remove videos
   * @description Remove product videos from structured data
   */
  removeVideos?: boolean;
}

export interface Props {
  /** @title Data Source */
  jsonLD: ProductListingPage | null;
  /** @title Title Override */
  title?: string;
  /** @title Description Override */
  description?: string;
  /** @hide true */
  canonical?: string;
  /**
   * @title Disable indexing
   * @description In testing, you can use this to prevent search engines from indexing your site
   */
  noIndexing?: boolean;
  configJsonLD?: ConfigJsonLD;
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

/** @title Product listing custom */
export function loader(_props: Props, _req: Request, ctx: AppContext) {
  const props = _props as Partial<Props>;
  const {
    titleTemplate = "",
    descriptionTemplate = "",
    ...seoSiteProps
  } = ctx.seo ?? {};
  const { title: titleProp, description: descriptionProp, jsonLD } = props;

  const url = new URL(_req.url).pathname === "/live/invoke"
    ? new URL(_req.headers.get("referer") || _req.url)
    : new URL(_req.url);

  const title = renderTemplateString(
    titleTemplate,
    titleProp || jsonLD?.seo?.title || ctx.seo?.title || "",
  );
  const description = renderTemplateString(
    descriptionTemplate,
    descriptionProp || jsonLD?.seo?.description || ctx.seo?.description || "",
  );
  // const canonical = props.canonical
  //   ? props.canonical
  //   : jsonLD?.seo?.canonical
  //   ? jsonLD.seo.canonical
  //   : jsonLD?.breadcrumb
  //   ? canonicalFromBreadcrumblist(jsonLD?.breadcrumb)
  //   : undefined;

  // const noIndexing =
  //   props.noIndexing ||
  //   !jsonLD ||
  //   !jsonLD.products.length ||
  //   jsonLD.seo?.noIndexing;

  const page = url.searchParams.get("pagina") || url.searchParams.get("pagina");

  const canonical = page && Number(page ?? 0) > 1
    ? `${url.origin}${url.pathname}?pagina=${page}`
    : `${url.origin}${url.pathname}`;

  if (props.configJsonLD?.removeVideos) {
    jsonLD?.products.forEach((product) => {
      product.video = undefined;
      product.isVariantOf?.hasVariant.forEach((variant) => {
        variant.video = undefined;
      });
    });
  }
  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: "Home",
      position: 1,
      item: `${url.origin}`,
    },
  ];

  const breadcrumb = {
    ...jsonLD?.breadcrumb,
    itemListElement: [
      ...newItems,
      ...(jsonLD?.breadcrumb?.itemListElement || []),
    ],
    numberOfItems: (jsonLD?.breadcrumb?.numberOfItems ?? 0) + 1,
  };
  const newBreadcrumb = breadcrumb?.itemListElement?.filter(
    ({ name, item }) => name && item,
  );

  const seoData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: newBreadcrumb?.map(
        (item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.item,
        } as ListItem),
      ) || [],
    },
  ];

  return {
    ...seoSiteProps,
    title,
    description,
    canonical,
    jsonLDs: seoData,
    pageInfo: jsonLD?.pageInfo,
    noIndexing: jsonLD?.seo?.noIndexing,
    // noIndexing: true,
    href: {
      origin: url.origin,
      pathname: url.pathname,
    },
  };
}

function Section(props: Props): SEOSection {
  return <Seo {...props} />;
}

export function LoadingFallback(props: Partial<Props>) {
  return <Seo {...props} />;
}

export { default as Preview } from "apps/website/components/_seo/Preview.tsx";

export default Section;
