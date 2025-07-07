import ProductData from "../../islands/ProductData.tsx";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { Product, ProductVariation } from "../../commerce/ContentTypes.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  contentPage: ProductVariation | null;
  productData: Product | null; // New prop for product data
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

function ProductDataLeafLet({ page, contentPage, productData }: Props) {
  // console.log(contentPage);

  const newItems: ListItem[] = [
    {
      "@type": "ListItem",
      name: productData?.substance?.substanceName ?? "",
      position: 3,
      item: `https://consultaremedios.com.br/${
        contentPage?.substance?.slug || productData?.substance.slug
      }/pa`,
    },
    {
      "@type": "ListItem",
      name: page?.product?.isVariantOf?.name ?? "",
      position: 4,
      item: `https://consultaremedios.com.br/${
        contentPage?.slug || productData?.slug
      }/p`,
    },
    {
      "@type": "ListItem",
      name: "Bula",
      position: 4,
      item: `https://consultaremedios.com.br/${
        contentPage?.slug || productData?.slug
      }/bula`,
    },
  ];

  const breadcrumb = page
    ? {
      ...page?.breadcrumbList,
      itemListElement: [
        ...page.breadcrumbList?.itemListElement.slice(0, -1),
        ...newItems,
      ],
      numberOfItems: page.breadcrumbList.numberOfItems - 1 + newItems.length,
    }
    : {
      itemListElement: [...newItems],
    };

  return (
    <>
      <ProductData
        typePage="MedicalWebPage"
        leafLetContent={contentPage}
        productDataLeafLet={productData}
        breadcrumb={breadcrumb}
      />
    </>
  );
}
export default ProductDataLeafLet;
