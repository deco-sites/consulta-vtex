import { SendEventOnView } from "../Analytics.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { DetailsPageLeaflet } from "../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import { useDevice } from "@deco/deco/hooks";
import LeafletInfoMobile from "./LeafletInfoMobile.tsx";
import LeafletInfoDesktop from "./LeafletInfoDesktop.tsx";
import { Product, ProductVariation } from "../../commerce/ContentTypes.ts";

interface Props {
  page: DetailsPageLeaflet | null;
  contentPage: Product | ProductVariation | null;
}

function LeafletInfo({ page, contentPage }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }
  const { breadcrumbList, product } = page;
  if (!breadcrumbList || !product) {
    return null;
  }

  const { offers } = product;

  const { price = 0, listPrice } = useOffer(offers);

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList?.numberOfItems - 1,
  };

  const eventItem = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const device = useDevice();

  // console.log(product.offerSellers);

  return (
    <div id={id}>
      {device == "mobile"
        ? <LeafletInfoMobile page={page} contentPage={contentPage} />
        : <LeafletInfoDesktop page={page} contentPage={contentPage} />}

      {/* Analytics Event */}
      <SendEventOnView
        id={id}
        event={{
          name: "view_item",
          params: {
            item_list_id: "product",
            item_list_name: "Product",
            items: [eventItem],
          },
        }}
      />
    </div>
  );
}

export default LeafletInfo;
