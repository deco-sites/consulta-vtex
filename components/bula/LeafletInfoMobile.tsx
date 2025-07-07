import { useId } from "../../sdk/useId.ts";
import { DetailsPageLeaflet } from "../../commerce/types.ts";
import { Product, ProductVariation } from "../../commerce/ContentTypes.ts";
import LeafletDetails from "./LeafletDetails.tsx";
import LeaftletBoxOffer from "./LeaftletBoxOffer.tsx";
// import LeafletHeader from "./LeafletHeader.tsx";

interface Props {
  page: DetailsPageLeaflet | null;
  contentPage: Product | ProductVariation | null;
}

function ProductInfoMobile({ page, contentPage }: Props) {
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
    <div class="flex flex-col px-1" id={id}>
      {/* Adicionar o cabeçalho no topo */}
      {
        /* {contentPage && (
        <div className="p-2">
          <LeafletHeader contentPage={contentPage} />
        </div>
      )} */
      }

      {product?.offerSellers && (
        <LeaftletBoxOffer
          maximumPrice={maximumPrice}
          slugProduct={slugProduct}
          minimumPrice={minimumPrice}
        />
      )}

      <div class="p-2">
        {contentPage && (
          <div>
            <LeafletDetails contentPage={contentPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfoMobile;
