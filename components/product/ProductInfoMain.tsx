import { SendEventOnView } from "../Analytics.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import { useDevice } from "@deco/deco/hooks";
import ProductInfoMainMobile from "./ProductInfoMainMobile.tsx";
import ProductInfoMainDesktop from "./ProductInfoMainDesktop.tsx";
import { Product } from "../../commerce/ContentTypes.ts";

interface Props {
  page: ProductDetailsPage | null;
  layout?: {
    /**
     * @title Product Name
     * @description How product title will be displayed. Concat to concatenate product and sku names.
     * @default product
     */
    name?: "concat" | "productGroup" | "product";
  };
  productContentMain: Product | null;
}

function ProductInfoMain({ page, layout, productContentMain }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { offers } = product;

  const { price = 0, listPrice } = useOffer(offers);

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const eventItem = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  // console.log("offers", offers);

  const device = useDevice();

  return (
    <div id={id}>
      {device == "mobile"
        ? (
          <ProductInfoMainMobile
            page={page}
            layout={layout}
            productContentInformations={productContentMain}
          />
        )
        : (
          <ProductInfoMainDesktop
            page={page}
            layout={layout}
            productContentInformations={productContentMain}
          />
        )}

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

export default ProductInfoMain;
