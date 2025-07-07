import { ProductDetailsPage } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props) {
  if (!page?.seo) {
    return <div></div>;
  }

  return (
    <div class="w-full max-w-[1366px] lg:px-10 flex flex-col gap-6 mx-auto">
      {/* Renderização dos produtos relacionados */}
      {page.relatedProducts && page.relatedProducts.length > 0 &&
        page.product.isVariantOf && page.product.isVariantOf && (
        <div className="py-4 px-2">
          <h2 className="text-2xl font-medium mb-3">
            Relacionado ao {page.product.isVariantOf?.name}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {page.relatedProducts.slice(0, 10).map((item) => {
              const urlParts = item.cleanAlias.split("/");
              const productUrlParts = [];

              for (let i = 0; i < urlParts.length; i++) {
                const part = urlParts[i];

                if (i <= 1) {
                  productUrlParts.push(part);
                } else if (part.length === 1) {
                  productUrlParts.push(part);
                  break;
                }
              }

              const productUrl = productUrlParts.join("/");

              return (
                <a
                  key={item.id}
                  href={productUrl}
                  className="text-[#009999] underline underline-offset-[3px] font-normal hover:text-inherit text-start text-sm"
                >
                  {item.nome}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  if (!props.page?.seo) {
    ctx.response.status = 404;
  }

  return props;
};

export function LoadingFallback() {
  return (
    <div
      style={{ height: "40px" }}
      className="flex justify-center flex-col px-4 lg:px-10 gap-4 lg:gap-6 py-2 lg:py-5 mx-auto max-w-[1366px]"
    >
      <div className="w-full">
        <div className="w-full h-8 bg-gray-300 animate-pulse rounded-lg max-lg:mt-4">
        </div>
      </div>
      <div className="lg:hidden w-full max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}
