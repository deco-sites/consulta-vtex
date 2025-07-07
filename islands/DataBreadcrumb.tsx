export interface Link {
  label?: string;
  href?: string;
}

export interface Props {
  breadcrumbs?: Link[];
  pageInfo?: {
    currentPage: number;
    nextPage: string | undefined;
    previousPage: string | undefined;
    records: number;
    recordPerPage?: number | undefined;
    totalPages?: number | undefined;
  };
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

function DataBreadcrumb({ breadcrumbs, pageInfo }: Props) {
  if (!breadcrumbs) {
    return null;
  }

  const newBreadcrumbs = [
    ...breadcrumbs,
    {
      "@type": "ListItem",
      label: `Página: ${
        (pageInfo?.currentPage ?? 0) > 1 ? pageInfo?.currentPage : ""
      }`,
      href: `${
        breadcrumbs[breadcrumbs.length - 1]?.href
      }?pagina=${pageInfo?.currentPage}`,
    },
  ];

  const BreadcrumbOptimized = (pageInfo?.currentPage ?? 0) > 1
    ? newBreadcrumbs?.map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label ?? "",
        item: item.label?.toLocaleLowerCase() == "home"
          ? "https://consultaremedios.com.br/"
          : `https://consultaremedios.com.br${item.href}` ??
            `https://consultaremedios.com.b/${item?.label?.toLocaleLowerCase()}`,
      } as ListItem),
    ) || []
    : breadcrumbs?.map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label ?? "",
        item: item.label?.toLocaleLowerCase() == "home"
          ? "https://consultaremedios.com.br/"
          : `https://consultaremedios.com.br${item.href}` ??
            `https://consultaremedios.com.b/${item?.label?.toLocaleLowerCase()}`,
      } as ListItem),
    ) || [];

  return (
    <>
      {" "}
      {(breadcrumbs?.length ?? 0) > 0 &&
        [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: BreadcrumbOptimized,
          },
        ]?.map((json) => (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(json),
            }}
          />
        ))}
    </>
  );
}

export default DataBreadcrumb;
