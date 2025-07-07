import Icon from "../../components/ui/Icon.tsx";
import DataBreadcrumb from "../../islands/DataBreadcrumb.tsx";

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

function BreadcrumbOptimized({ breadcrumbs, pageInfo }: Props) {
  return (
    <div class="breadcrumbs overflow-hidden max-lg:px-4">
      <ul>
        {breadcrumbs?.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index}>
              {!item.href || (isLast && (pageInfo?.currentPage ?? 0) < 2)
                ? <p class="text-sm text-secondary capitalize">{item.label}</p>
                : (
                  <a
                    class="text-sm text-secondary capitalize hover:text-black"
                    aria-label={`link ${item.label}`}
                    href={item.href}
                  >
                    {item.label?.toLocaleLowerCase() === "home" && (
                      <Icon class="mr-2" id="Home" size={14} />
                    )}
                    {item.label}
                  </a>
                )}
            </li>
          );
        })}
        {(pageInfo?.currentPage ?? 0) > 1 && (
          <li>
            <p class="text-sm text-secondary">
              {" "}
              Página: {pageInfo?.currentPage}
            </p>
          </li>
        )}
      </ul>
      {(breadcrumbs?.length ?? 0) > 0 && (
        <DataBreadcrumb breadcrumbs={breadcrumbs} pageInfo={pageInfo} />
      )}
    </div>
  );
}

export default BreadcrumbOptimized;
