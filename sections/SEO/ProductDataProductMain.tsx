import ProductData from "../../islands/ProductData.tsx";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { Product } from "../../commerce/ContentTypes.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  contentPageMain: Product | null;
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

function ProductDataProductMain({ page, contentPageMain }: Props) {
  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: contentPageMain?.substance?.substanceName ?? "",
      position: 3,
      item:
        `https://consultaremedios.com.br/${contentPageMain?.substance?.slug}/pa`,
    },
    {
      "@type": "ListItem",
      name: page?.product?.isVariantOf?.name ?? "",
      position: 4,
      item: `https://consultaremedios.com.br/${contentPageMain?.slug}/p`,
    },
  ];

  const breadcrumb = {
    ...page?.breadcrumbList,
    itemListElement: [
      ...page?.breadcrumbList?.itemListElement.slice(0, -1),
      ...newItems,
    ],
    numberOfItems: page?.breadcrumbList?.numberOfItems - 1 + newItems.length,
  };

  return (
    <>
      <ProductData
        typePage="ProductMain"
        productMainContent={contentPageMain}
        breadcrumb={breadcrumb}
        productMainData={page?.product}
      />
    </>
  );
}
export default ProductDataProductMain;
