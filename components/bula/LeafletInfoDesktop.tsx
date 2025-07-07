import { useId } from "../../sdk/useId.ts";
import { DetailsPageLeaflet } from "../../commerce/types.ts";
import { Product, ProductVariation } from "../../commerce/ContentTypes.ts";
import LeafletDetails from "./LeafletDetails.tsx";
import LeaftletBoxOffer from "./LeaftletBoxOffer.tsx";
//import LeafletHeader from "./LeafletHeader.tsx";

interface Props {
  page: DetailsPageLeaflet | null;
  contentPage: Product | ProductVariation | null;
}

function ProductInfoDesktop({ page, contentPage }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product } = page;

  const slugProduct = contentPage?.slug
    ? `/${contentPage?.slug}/p`
    : `/${contentPage?.substance.slug}/pa`;
  const maximumPrice = product?.buyBox?.maximumPrice;
  const minimumPrice = product?.buyBox?.minimumPrice;

  return (
    <div id={id}>
      {/* Adicionar o cabeçalho antes do grid */}
      {
        /* {contentPage && (
        <LeafletHeader contentPage={contentPage} />
      )} */
      }

      <div class="grid grid-cols-3 gap-6 max-w-[1366px] mx-auto lg:px-10">
        {/* Conteúdo da bula */}
        <div class="mt-4 lg:mt-0 col-span-2">
          {contentPage && (
            <div class="col-span-2">
              <LeafletDetails contentPage={contentPage} />
            </div>
          )}
        </div>

        {/* Sellers */}
        {product?.offerSellers && (
          <LeaftletBoxOffer
            maximumPrice={maximumPrice}
            slugProduct={slugProduct}
            minimumPrice={minimumPrice}
          />
        )}
      </div>
    </div>
  );
}

export default ProductInfoDesktop;
