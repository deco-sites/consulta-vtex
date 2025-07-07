import ImageGallerySlider from "../../components/product/Gallery/ImageSlider.tsx";
import { useId } from "../../sdk/useId.ts";
import { ProductDetailsPage } from "../../commerce/types.ts";
import ProductSelector from "../../islands/ProductVariantSelector.tsx";
import ProductBuyBox from "../../islands/ProductBuyBox.tsx";
import { ProductVariation } from "../../commerce/ContentTypes.ts";
import ProductBula from "./ContentProductPage/ProductBula.tsx";
import ProductDescription from "./ContentProductPage/ProductDescription.tsx";
import ProductSpecifications from "./ContentProductPage/ProductSpecifications.tsx";
import MedicationWarning from "./ContentProductPage/MedicationWarning.tsx";
import ManufacturerInfo from "./ContentProductPage/ManufacturerInfo.tsx";
import BrandInfo from "./ContentProductPage/BrandInfo.tsx";
import Icon from "deco-sites/consul-remedio/components/ui/Icon.tsx";
import ProductSimiliars from "./ProductSimiliars.tsx";
import { formatarTextoParaHref } from "../../sdk/format.ts";
interface Props {
  page: ProductDetailsPage | null;
  productContentInformations: ProductVariation | null;
  layout?: {
    /**
     * @title Product Name
     * @description How product title will be displayed. Concat to concatenate product and sku names.
     * @default product
     */
    name?: "concat" | "productGroup" | "product";
  };
}

function ProductInfoMobile({
  page,
  layout,
  productContentInformations,
}: Props) {
  const id = useId();

  function returnValidationPriceMedicine():
    | false
    | {
      measure: string | null | undefined;
      quantidadeDivisoria: number | null;
    } {
    const packageItems = productContentInformations?.packageItem;
    if (!Array.isArray(packageItems) || packageItems.length === 0) {
      return false;
    }

    const eligible = packageItems.filter((item) => item.unitPriceCalc);
    if (eligible.length > 0) {
      const first = eligible[0];
      const unitRef = first.unit?.id ?? null;
      const pharmaceuticRef = first?.pharmaceuticForm?.id ?? null;
      const kitProductRef = first?.kitProduct?.id ?? null;

      const unidadesDiferentes = eligible.some(
        (item) => (item.unit?.id ?? null) !== unitRef,
      );

      // Regra 3: forma farmacêutica diferente
      const formsDiferentes = eligible.some(
        (item) => (item?.pharmaceuticForm?.id ?? null) !== pharmaceuticRef,
      );

      // Regra 4: kit product diferente
      const kitsDiferentes = eligible.some(
        (item) => (item.kitProduct?.id ?? null) !== kitProductRef,
      );

      // Se alguma divergir, não exibe
      if (unidadesDiferentes || formsDiferentes || kitsDiferentes) {
        return false;
      }

      let measure;
      let count = 0;

      while (!measure) {
        if (eligible[count]?.volume) {
          measure = eligible[count]?.unit.unitName;
        } else {
          if (eligible[count]?.pharmaceuticForm?.pharmaceuticFormName) {
            measure = eligible[count]?.pharmaceuticForm?.pharmaceuticFormName;
          } else {
            measure = eligible[count]?.kitProduct?.kitProductName;
          }
        }

        count++;
      }

      const divisora = eligible.reduce((total, item) => {
        const qty = Number(item?.unitQuantity) || 0;
        const vol = Number(item?.volume) || NaN;
        // se vol for NaN, usa só qty
        return total + (isFinite(vol) ? qty * vol : qty);
      }, 0);

      return {
        quantidadeDivisoria: divisora,
        measure,
      };
    } else {
      const first = packageItems[0];
      const unitRef = first.unit?.id ?? null;
      const pharmaceuticRef = first?.pharmaceuticForm?.id ?? null;
      const kitProductRef = first.kitProduct?.id ?? null;

      const unidadesDiferentes = packageItems.some(
        (item) => (item.unit?.id ?? null) !== unitRef,
      );

      // Regra 3: forma farmacêutica diferente
      const formsDiferentes = packageItems.some(
        (item) => (item?.pharmaceuticForm?.id ?? null) !== pharmaceuticRef,
      );

      // Regra 4: kit product diferente
      const kitsDiferentes = packageItems.some(
        (item) => (item.kitProduct?.id ?? null) !== kitProductRef,
      );

      // Se alguma divergir, não exibe
      if (unidadesDiferentes || formsDiferentes || kitsDiferentes) {
        return false;
      }

      let measure;
      let count = 0;

      while (!measure) {
        if (packageItems[count]?.volume) {
          measure = packageItems[count]?.unit.unitName;
        } else {
          if (packageItems[count]?.pharmaceuticForm?.pharmaceuticFormName) {
            measure = packageItems[count]?.pharmaceuticForm
              ?.pharmaceuticFormName;
          } else {
            measure = packageItems[count]?.kitProduct?.kitProductName;
          }
        }

        count++;
      }

      const divisora = packageItems.reduce((total, item) => {
        const qty = Number(item?.unitQuantity) || 0;
        const vol = Number(item?.volume) || NaN;
        // se vol for NaN, usa só qty
        return total + (isFinite(vol) ? qty * vol : qty);
      }, 0);

      return {
        quantidadeDivisoria: divisora,
        measure,
      };
    }
  }

  // const pricePerMeasure = returnValidationPriceMedicine();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product, parentProducts, genericProducts, productVariantIdParams } =
    page;
  const {
    name = "",
    isVariantOf,
    brand,
    additionalProperty,
    productID,
  } = product;

  const attributes = additionalProperty?.filter(
    (att) =>
      att.name?.toLocaleLowerCase() === "Princípio ativo".toLocaleLowerCase() ||
      att.name?.toLocaleLowerCase() === "Tipo de receita".toLocaleLowerCase() ||
      att.name?.toLocaleLowerCase() ===
        "Temperatura de armazenamento".toLocaleLowerCase(),
  );

  const icons = [
    {
      name: "Princípio ativo",
      idIcon: "IconSubstance",
    },
    {
      name: "Tipo de receita",
      idIcon: "IconMedicineType",
    },
    {
      name: "Temperatura de armazenamento",
      idIcon: "IconTemperature",
    },
  ];

  const enrichedAttributes = attributes?.map((att) => {
    const icon = icons.find(
      (icon) => icon.name.toLocaleLowerCase() === att.name?.toLocaleLowerCase(),
    );
    return {
      ...att,
      idIcon: icon?.idIcon || "",
    };
  });

  const productOffers = productVariantIdParams
    ? product?.offerSellers?.filter(
      (offer) => offer.productID === Number(productVariantIdParams),
    )
    : product?.offerSellers?.filter((item) => item.price !== 0.01);

  return (
    <div class="flex flex-col px-1" id={id}>
      {/* Code and name */}
      <div class="">
        <div class="p-2">
          <h1>
            <span class="font-medium text-xl capitalize text-info">
              {layout?.name === "concat"
                ? `${isVariantOf?.name} ${name}`
                : layout?.name === "productGroup"
                ? isVariantOf?.name
                : name}
            </span>
          </h1>
          <div class="lg:p-2 h-8 lg:pt-0 max-lg:pt-2">
            <div
              class="konfidency-reviews-summary"
              data-sku={`${productID}`}
            >
            </div>
          </div>
          {brand && (
            <a
              class="text-primary text-sm underline hover:text-info py-2 flex w-full"
              arial-aria-label="link brand"
              href={brand.url}
            >
              {brand.name}
            </a>
          )}
        </div>
        <ImageGallerySlider page={page} />
      </div>
      <div>
        {/* Sellers */}
        {productOffers && (
          <ProductBuyBox
            productOffers={productOffers}
            product={product}
            // pricePerMeasureMedicine={pricePerMeasure}
          />
        )}
      </div>
      {/* Sku Selector */}
      <div class="mt-4 sm:mt-6 px-2 py-4 border-b border-neutral overflow-hidden">
        <ProductSelector product={product} />
      </div>
      {(product.variantsProperty?.length ?? 0) < 2 &&
        parentProducts &&
        parentProducts?.length > 1 && (
        <ProductSimiliars product={product} parentProducts={parentProducts} />
      )}

      {enrichedAttributes && enrichedAttributes?.length > 0 && (
        <ul class="flex flex-col gap-2 mt-3 py-4 border-t">
          {enrichedAttributes?.map((attr, index) => (
            <li key={index} style={{ order: index }}>
              {attr.name == "Princípio ativo"
                ? (
                  <a
                    arial-label="link brand"
                    class="text-sm px-2 hover:underline flex gap-1 items-center"
                    href={`/${formatarTextoParaHref(attr?.value ?? "")}/pa`}
                  >
                    <Icon id={attr.idIcon} size={16} className="min-w-fit" />
                    {attr.value}
                  </a>
                )
                : (
                  <p class="text-sm px-2 flex gap-1 items-center">
                    <Icon
                      id={attr.idIcon}
                      size={16}
                      class="flex-shrink-0 min-w-fit"
                    />
                    <span class="min-w-0 flex-1 break-words">{attr.value}</span>
                  </p>
                )}
            </li>
          ))}
          <li key={enrichedAttributes?.length} style={{ order: 2 }}>
            <p class="text-sm px-2 flex gap-1 items-center">
              <Icon id="IconBeBroken" size={16} />
              {productContentInformations?.canBeSplitted
                ? "Pode ser partido"
                : "Não pode ser partido"}
            </p>
          </li>
        </ul>
      )}

      {productContentInformations?.product.highlight && (
        <div class="more-products p-2 mt-0">
          <h2 class="text-xl mb-1 p-2">Mais sobre este produto</h2>
          <div
            class="dinamic-html ml-3"
            dangerouslySetInnerHTML={{
              __html: productContentInformations?.product.highlight,
            }}
          >
          </div>
        </div>
      )}
      <div class="p-2">
        {productContentInformations && (
          <div>
            <ProductBula contentPage={productContentInformations} />
            <ProductDescription contentPage={productContentInformations} />
            <ProductSpecifications
              contentPage={productContentInformations}
              product={product}
              genericProducts={genericProducts}
            />
            <MedicationWarning contentPage={productContentInformations} />
            <BrandInfo contentPage={productContentInformations} />
            <ManufacturerInfo contentPage={productContentInformations} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfoMobile;
