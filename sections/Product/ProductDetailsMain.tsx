import { ProductDetailsPage } from "../../commerce/types.ts";
import ProductInfoMain from "../../components/product/ProductInfoMain.tsx";
import Breadcrumb from "deco-sites/consul-remedio/components/ui/Breadcrumb.tsx";
import NotFound from "./NotFound.tsx";
import { Product } from "../../commerce/ContentTypes.ts";
import { AppContext } from "../../apps/site.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

export default function ProductDetailsMain({
  props,
  req,
}: {
  props: Props;
  req: Request;
}) {
  const { page } = props;
  if (!page?.seo) {
    return <NotFound />;
  }

  if (!page.productMainContent?.id) {
    return <NotFound />;
  }

  const url = new URL(req.url).pathname === "/live/invoke"
    ? new URL(req.headers.get("referer") || req.url)
    : new URL(req.url);

  const isHaveParentProducts = page?.parentProducts
    ?.filter(
      (product) =>
        product?.additionalProperty?.find(
          (property) => property.name === "Spot" && property.value,
        )?.value,
    )
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name),
    );

  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: page.productMainContent?.substance?.substanceName ?? "",
      position: 3,
      item: `${url.origin}/${page.productMainContent?.substance?.slug}/pa`,
    },
    {
      "@type": "ListItem",
      name: page.productMainContent?.title ?? "",
      position: 4,
      item: `${url.origin}/${page.productMainContent?.slug}/p`,
    },
    {
      "@type": "ListItem",
      name: (isHaveParentProducts?.length ?? 0) > 1
        ? ""
        : page.product?.name?.replace(
          `${page.productMainContent?.title}`,
          "",
        ) ?? "",
      position: 5,
      item: url.href,
    },
  ];

  const breadcrumb = {
    ...page.breadcrumbList,
    itemListElement: [
      ...page.breadcrumbList?.itemListElement.slice(0, -1),
      ...newItems,
    ],
    numberOfItems: page.breadcrumbList.numberOfItems - 1 + newItems.length,
  };

  return (
    <div class="w-full max-w-[1366px] lg:px-10 flex flex-col gap-6 mx-auto">
      <div class="flex flex-col lg:gap-6 text-info">
        <div class="w-full overflow-auto py-4 px-4 lg:px-0 max-lg:pb-2">
          <Breadcrumb itemListElement={breadcrumb.itemListElement} />
        </div>
        <ProductInfoMain
          page={page}
          productContentMain={page.productMainContent}
          layout={{ name: "productGroup" }}
        />
      </div>
    </div>
  );
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  if (!props.page?.seo) {
    ctx.response.status = 404;
  }

  if (!props.page?.productMainContent?.id) {
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
