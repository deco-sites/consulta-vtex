import { ProductDetailsPage } from "../../commerce/types.ts";
import ProductVariantComparison from "../../components/product/ContentProductPage/ProductVariantComparison.tsx";

export interface ContentProductProps {
  contentPage: ProductDetailsPage | null;
}

function ContentProductPage({ contentPage }: ContentProductProps) {
  if (!contentPage || !contentPage?.productContent || !contentPage?.product) {
    return <div className="p-4 text-gray-500"></div>;
  }

  return (
    <div className="w-full max-w-[1366px] lg:px-10 mx-auto">
      <style jsx>
        {`
          .prose table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
          }
          .prose th,
          .prose td {
            border: 3px solid #aaa;
            padding: 0.75rem;
            text-align: left;
          }
          .prose th,
          .prose tr:nth-child(odd) td {
            border: 3px solid #aaa;
            padding: 0.75rem;
            text-align: left;
            background-color: #f7f7f7;
          }
          .prose th {
            background-color: #f8fafc;
          }
          .prose a {
            color: #009999;
            text-decoration: underline;
            text-underline-offset: 3.5px;
          }
          .prose a:hover {
            text-decoration: underline !important;
            color: inherit;
          }
          .prose h2 {
            font-size: calc(1.3rem + 0.6vw);
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            line-height: 120%;
            color: #212529;
            padding: 17px 0;
          }
          .prose h3 {
            font-family: Inter;
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 700;
            line-height: 120%;
            margin: 16px 0;
          }
          .prose h4 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-weight: 500;
            line-height: 1.2;
          }
          .prose li {
            padding-left: 1rem;
            position: relative;
            margin-left: 18px;
          }
          .prose li::before {
            content: "";
            position: absolute;
            top: 8px;
            left: 0;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background-color: #009999;
          }
          .prose li,
          .prose p {
            font-family: Inter;
            font-size: 1.125rem;
            font-style: normal;
            font-weight: 400;
            line-height: 150%;
            margin-bottom: 12px;
          }
          @media (max-width: 640px) {
            .prose table {
              display: block;
              overflow-x: auto;
            }
          }
          @media (min-width: 1200px) {
            .prose h2 {
              font-size: 2rem;
            }
            .prose h3 {
              font-size: 1.75rem;
            }
            .prose h4 {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
      {/* Componente de comparação de variações */}
      <ProductVariantComparison
        product={contentPage.productContent.product}
        currentVariation={contentPage.productContent}
      />
    </div>
  );
}

export function LoadingFallback() {
  return (
    <div
      style={{ height: "600px" }}
      class="flex justify-center flex-col px-4 lg:px-10 gap-6 py-8 lg:py-10 mx-auto max-w-[1366px]"
    >
      <div class="w-full max-h-[500px] max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}

export default ContentProductPage;
