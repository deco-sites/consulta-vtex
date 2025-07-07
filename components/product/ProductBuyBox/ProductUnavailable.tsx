import OutOfStock from "../OutOfStock.tsx";
import { Product } from "../../../commerce/types.ts";

interface Props {
  productId: number;
  product: Product;
}

function ProductUnavailable({ productId, product }: Props) {
  const { categoryProperty } = product;

  const mainCategory = categoryProperty?.find(
    (category) => category.categorytype,
  );

  return (
    <div class="max-lg:mt-3">
      <div class="bg-[#E2E6EA] p-4 text-secondary-content">
        <div class="pb-4 border-b border-secondary mb-4 tracking-[.009375rem]">
          <p class="font-medium text-black">Produto Indisponível para venda</p>
          <p>A indisponibilidade pode estar relacionada a:</p>
        </div>
        <div>
          (i) venda exclusiva à hospitais, (ii) venda controlada mediante
          retenção da receita ou (iii) esgotaram-se o estoque.
        </div>
      </div>
      <a
        class="text-primary my-3 underline text-sm font-light hidden"
        aria-label="link de produtos indisponíveis"
      >
        {" "}
        Saiba mais sobre produtos indisponíveis
      </a>
      <OutOfStock productID={productId} />

      <div class="flex text-secondary gap-4 items-center mt-3">
        <p class="font-medium text-lg">Indisponível</p>
        <a
          href={`${
            mainCategory?.url
              ?.replace("medicamentos", "")
              .replace("beleza-e-saude", "")
          }/c`}
          class="cursor-pointer max-w-full w-full disabled:loading font-normal rounded bg-primary hover:bg-accent duration-300 hover:scale-95 text-white py-3 flex justify-center"
          aria-label="link de produtos similares"
        >
          Ver similares
        </a>
      </div>
    </div>
  );
}

export default ProductUnavailable;
