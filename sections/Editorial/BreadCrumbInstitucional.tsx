import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";

export interface Link {
  label?: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: Link[];
}

function Breadcrumb(props: BreadcrumbProps) {
  const { items } = props;

  if (!items || items.length === 0) return null;

  return (
    <div class="breadcrumbs overflow-x-auto p-4 mx-auto max-w-7xl">
      <BreadcrumbOptimized breadcrumbs={items} />
    </div>
  );
}
export function LoadingFallback() {
  return <div>loading...</div>;
}

export default Breadcrumb;
