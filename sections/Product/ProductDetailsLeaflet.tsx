import { DetailsPageLeaflet } from "../../commerce/types.ts";
import LeafletInfo from "../../components/bula/LeafletInfo.tsx";
import LeafletHeader from "../../components/bula/LeafletHeader.tsx";
import Breadcrumb from "deco-sites/consul-remedio/components/ui/Breadcrumb.tsx";
import NotFound from "../../sections/Product/NotFound.tsx";
import { AppContext } from "../../apps/site.ts";
import LeafletDetailsSubstance from "../../components/bula/LeafletDetailsSubstance.tsx";
// import ProductData from "../../islands/ProductData.tsx";

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}
export interface Props {
  /** @title Integration */
  page: DetailsPageLeaflet | null;
}

export default function ProductDetailsLeaflet({
  props,
  req,
}: {
  props: Props;
  req: Request;
}) {
  const { page } = props;

  const bulaData = page?.productMainContent;

  if (!bulaData?.substance || !bulaData?.substance?.slug) {
    return <NotFound />;
  }

  const url = new URL(req.url).pathname === "/live/invoke"
    ? new URL(req.headers.get("referer") || req.url)
    : new URL(req.url);

  // console.log("bulaData", bulaData);

  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: bulaData?.substance?.substanceName ?? "",
      position: 3,
      item: `${url.origin}/${bulaData?.substance?.slug ?? bulaData?.slug}/pa`,
    },
    {
      "@type": "ListItem",
      name: bulaData?.slug ? bulaData?.title ?? "" : "",
      position: 4,
      item: `${url.origin}/${bulaData?.slug ?? bulaData?.substance?.slug}/p`,
    },
    {
      "@type": "ListItem",
      name: "Bula",
      position: 5,
      item: `${url.origin}/${bulaData?.slug ?? bulaData?.substance?.slug}/bula`,
    },
  ];

  const breadcrumb = page && bulaData?.slug && page?.breadcrumbList
    ? {
      ...page?.breadcrumbList,
      itemListElement: [
        ...page?.breadcrumbList?.itemListElement.slice(0, -1),
        ...newItems,
      ],
      numberOfItems: page?.breadcrumbList?.numberOfItems - 1 + newItems.length,
    }
    : {
      itemListElement: [...newItems],
    };

  return (
    <div class="w-full flex flex-col gap-6 mx-auto">
      <div class="flex flex-col lg:gap-6 text-info">
        <div class="w-full overflow-auto py-4 px-4 max-lg:pb-2 max-w-[1366px] mx-auto lg:px-10">
          <Breadcrumb itemListElement={breadcrumb.itemListElement} />
        </div>

        {page?.seo
          ? (
            <>
              <LeafletHeader contentPage={bulaData} />
              <LeafletInfo page={page} contentPage={bulaData} />
            </>
          )
          : (
            <>
              <LeafletHeader contentPage={bulaData} />
              <LeafletDetailsSubstance contentPage={bulaData} />
            </>
          )}
      </div>
    </div>
  );
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const bulaData = props?.page?.productMainContent;

  if (!bulaData?.substance || !bulaData?.substance?.slug) {
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
