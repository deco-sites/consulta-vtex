import {
  Product as ProductContent,
  ProductVariation,
} from "../commerce/ContentTypes.ts";
import { Product as ProductDataMain } from "../commerce/types.ts";
import { BreadcrumbList } from "apps/commerce/types.ts";
import { generateProductJsonLd } from "../sdk/structuredDataProduct.tsx";
// import { Left } from "deco-sites/consul-remedio/static/adminIcons.ts";

export interface Props {
  typePage:
    | "ProductVariant"
    | "ProductMain"
    | "OnlineStore"
    | "Drug"
    | "ListItem"
    | "MedicalWebPage";
  breadcrumb?: BreadcrumbList["itemListElement"];
  productContent?: ProductVariation | ProductContent | null;
  leafLetContent?: ProductVariation | null;
  productDataLeafLet?: ProductContent | null;
  productMainContent?: ProductContent | null;
  productMainData?: ProductDataMain;
  productVariantContent?: ProductVariation | null;
  productVariantData?: ProductDataMain;
}

function ProductData({
  typePage,
  breadcrumb,
  productContent,
  leafLetContent,
  productDataLeafLet,
  productMainContent,
  productMainData,
  productVariantData,
  productVariantContent,
}: Props) {
  const jsonLd = generateProductJsonLd({
    typePage,
    breadcrumb,
    productContent,
    leafLetContent,
    productDataLeafLet,
    productMainContent,
    productMainData,
    productVariantData,
    productVariantContent,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}

export default ProductData;
