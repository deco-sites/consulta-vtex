import { SendEventOnView } from "../../components/Analytics.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { mapProductToAnalyticsItem } from "../../commerce/utils/productToAnalyticsItem.ts";
import { useDevice } from "@deco/deco/hooks";
import ProductInfoMobile from "../../components/product/ProductInfoMobile.tsx";
import ProductInfoDesktop from "../../components/product/ProductInfoDesktop.tsx";
import { ProductVariation } from "../../commerce/ContentTypes.ts";

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
  productContentInformations: ProductVariation | null;
  offerId: number | null | undefined;
}

function ProductInfo({
  page,
  layout,
  productContentInformations,
  offerId,
}: Props) {
  let priceOffer: undefined | number;
  if (offerId) {
    const offerFind = page?.product.offerSellers?.find(
      (product) => product.productID == offerId,
    );
    if (offerFind) {
      priceOffer = offerFind.price;
    }
  }

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
    priceOffer,
    offerId,
  });

  const device = useDevice();

  return (
    <div id={id}>
      {device == "mobile"
        ? (
          <ProductInfoMobile
            page={page}
            layout={layout}
            productContentInformations={productContentInformations}
          />
        )
        : (
          <ProductInfoDesktop
            page={page}
            layout={layout}
            productContentInformations={productContentInformations}
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

export default ProductInfo;
