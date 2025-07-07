import type { ImageWidget } from "apps/admin/widgets.ts";
import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
export interface Link {
  label?: string;
  href?: string;
}

export interface Props {
  breadcrumb?: Link[];
  title?: string;
  description?: string;
  image?: ImageWidget;
}
function ContentTop({ breadcrumb, title, description, image }: Props) {
  return (
    <section class="bg-[#E7F1FF] pt-4">
      <div class="max-[1366px] lg:px-10 max-lg:mb-8">
        <BreadcrumbOptimized breadcrumbs={breadcrumb} />
      </div>

      <div class="flex flex-col gap-5 max-lg:items-center lg:flex-row max-[1366px] lg:px-10 lg:gap-10">
        <div class="my-auto max-lg:px-4">
          <h1 class="text-[2rem] font-medium tracking-[-.09375rem] leading-tight text-info mb-2">
            {title}
          </h1>
          <p class="tracking-[.009375rem] text-secondary-content">
            {description}
          </p>
        </div>
        <img width={200} height={225} class="max-lg:max-w-56" src={image} />
      </div>
    </section>
  );
}
export function LoadingFallback() {
  return <div>loading...</div>;
}

export default ContentTop;
