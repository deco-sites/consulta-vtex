import { ProductDetailsPage } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import KonfidencyComponents from "deco-sites/consul-remedio/islands/Konfidency.tsx";
export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function Konfidency({ props }: { props: Props; req: Request }) {
  const { page } = props;

  if (!page?.seo) {
    return null;
  }

  return (
    <KonfidencyComponents productId={Number(page.product?.productID ?? 0)} />
  );
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  if (!props.page?.seo) {
    ctx.response.status = 404;
  }

  return { props: props, req: req };
};

export function LoadingFallback() {
  return (
    <div
      style={{ height: "600px" }}
      className="flex justify-center flex-col px-4 lg:px-10 gap-4 lg:gap-6 py-2 lg:py-5 mx-auto max-w-[1366px]"
    >
      <div className="w-full">
        <div className="w-full h-8 bg-gray-300 animate-pulse rounded-lg max-lg:mt-4">
        </div>
      </div>
      <div className="hidden lg:grid grid-cols-3 gap-4 w-full max-w-[1366px] mx-auto h-full">
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
      </div>
      <div className="lg:hidden w-full max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}
