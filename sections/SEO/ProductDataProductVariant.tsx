import ProductData from "../../islands/ProductData.tsx";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { ProductVariation } from "../../commerce/ContentTypes.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  contentPage: ProductVariation | null;
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

function ProductDataProductVariant({ page, contentPage }: Props) {
  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: contentPage?.substance.substanceName ?? "",
      position: 3,
      item: `https://consultaremedios.com.br/${contentPage?.substance.slug}/pa`,
    },
    {
      "@type": "ListItem",
      name: page.product?.isVariantOf?.name ?? "",
      position: 4,
      item: `https://consultaremedios.com.br/${contentPage?.product.slug}/p`,
    },
    {
      "@type": "ListItem",
      name: page?.product?.name?.replace(
        `${page?.product?.isVariantOf?.name}`,
        "",
      ) ??
        "",
      position: 5,
      item: "https://consultaremedios.com.br/",
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
        typePage="ProductVariant"
        breadcrumb={breadcrumb}
        productVariantContent={contentPage}
        productVariantData={page?.product}
      />
    </>
  );
}
export default ProductDataProductVariant;
