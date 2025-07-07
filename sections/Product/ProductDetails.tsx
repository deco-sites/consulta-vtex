import { ProductDetailsPage } from "../../commerce/types.ts";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "deco-sites/consul-remedio/components/ui/Breadcrumb.tsx";
import NotFound from "../../sections/Product/NotFound.tsx";
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

export default function ProductDetails({
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

  const url = new URL(req.url).pathname === "/live/invoke"
    ? new URL(req.headers.get("referer") || req.url)
    : new URL(req.url);

  const referer = req.headers.get("referer");

  let offerId;
  if (referer) {
    const url = new URL(referer);
    offerId = url.searchParams.get("variant_id");
    offerId = offerId ? Number(offerId) : null;
  }

  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: page?.productContent?.substance.substanceName ?? "",
      position: 4,
      item: `${url.origin}/${page?.productContent?.substance.slug}/pa`,
    },
    {
      "@type": "ListItem",
      name: page?.productContent?.product?.title ?? "",
      position: 5,
      item: `${url.origin}/${page?.productContent?.product.slug}/p`,
    },
    {
      "@type": "ListItem",
      name: page.product?.name?.replace(
        `${page?.productContent?.product?.title}`,
        "",
      ) ?? "",
      position: 6,
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
        <ProductInfo
          page={page}
          productContentInformations={page?.productContent ?? null}
          offerId={offerId}
        />
      </div>
    </div>
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
