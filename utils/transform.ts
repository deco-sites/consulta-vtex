import {
  BreadcrumbList,
  BuyBox,
  CategoryValue,
  FilterRange,
  ListItem,
  OfferItemCondition,
  OfferSellers,
  Product,
  ProductListingPage,
  PropertyValue,
  PropertyValueVariant,
  UnitPriceSpecification,
} from "../commerce/types.ts";
import { DEFAULT_IMAGE } from "../commerce/utils/constants.ts";
import {
  BuyList,
  ProductFragment,
  SearchQuery,
  SingleProductFragment,
} from "./graphql/storefront.graphql.gen.ts";

export const FILTER_PARAM = "filtro";

export const CONDITIONS: Record<string, OfferItemCondition> = {
  Novo: "https://schema.org/NewCondition",
  Usado: "https://schema.org/UsedCondition",
  Renovado: "https://schema.org/RefurbishedCondition",
  Danificado: "https://schema.org/DamagedCondition",
};

export const camposAdicionais = [
  "Atacado",
  "Estoque",
  "Atributo",
  "Informacao",
  "TabelaPreco",
];

export const parseSlug = (slug: string) => {
  const segments = slug.split("-");
  const id = Number(segments.at(-1));

  if (!id) {
    throw new Error("Malformed slug. Expecting {slug}-{id} format");
  }

  return {
    slug: segments.slice(0, -1).join("-"),
    id: Number(segments.at(-1)),
  };
};

export const getProductUrl = (
  { alias }: ProductFragment | SingleProductFragment,
  base: URL | string,
) => new URL(`/produto/${alias}`, base);

export const getVariantUrl = (
  variant: ProductFragment | SingleProductFragment | BuyList,
  base: URL | string,
  variantId?: string,
) => {
  const url = getProductUrl(variant, base);

  url.searchParams.set("skuId", variantId ?? variant.productVariantId);

  return url;
};

type WakeFilterItem = NonNullable<
  NonNullable<NonNullable<SearchQuery["result"]>["aggregations"]>["filters"]
>[0];

export const toFilterItem = (filter: WakeFilterItem, base: URL) => ({
  "@type": "FilterToggle" as const,
  key: filter?.origin ?? "",
  label: filter?.field ?? "",
  quantity: filter?.values?.length ?? 0,
  values: filter?.values?.map((filterValue) => {
    const url = new URL(base);
    const { name, quantity } = filterValue!;

    const filterParams = url.searchParams.getAll(FILTER_PARAM);

    const index = filterParams.findIndex(
      (f) => (f.split("__")[1] || f.split(":")[1]) === name,
    );

    const selected = index > -1;

    if (selected) {
      const params = new URLSearchParams();
      url.searchParams.forEach((value, key) => {
        if (key !== FILTER_PARAM || !value.endsWith(name!)) {
          params.append(key, value);
        }
      });
      url.search = `${params}`;
    } else {
      url.searchParams.append(FILTER_PARAM, `${filter.field}__${name}`);
    }

    return {
      value: name!,
      label: name!,
      quantity: quantity!,
      selected,
      url: url.href,
    };
  }) ?? [],
});

export const toPriceFilter = (
  filter: NonNullable<
    NonNullable<
      NonNullable<SearchQuery["result"]>["aggregations"]
    >["priceRanges"]
  >,
  base: URL,
) => ({
  "@type": "FilterToggle" as const,
  key: "precoPor",
  label: "Preço",
  quantity: filter.length ?? 0,
  values: filter.map((filterValue) => {
    const url = new URL(base);
    const { range, quantity } = filterValue!;
    const [min, max] = range?.split("-") ?? [];
    const name = `${min};${max}`;

    const isDirectParam = url.searchParams.getAll("precoPor");

    const filterParams = isDirectParam
      ? isDirectParam
      : url.searchParams.getAll(FILTER_PARAM);

    const index = isDirectParam
      ? filterParams.findIndex((f) => f === name)
      : filterParams.findIndex(
        (f) => (f.split("__")[1] || f.split(":")[1]) === name,
      );

    const selected = index > -1;

    if (selected) {
      const params = new URLSearchParams();
      url.searchParams.forEach((value, key) => {
        if (
          (key !== FILTER_PARAM && key !== "precoPor") ||
          !value.endsWith(name)
        ) {
          params.append(key, value);
        }
      });
      url.search = `${params}`;
    } else {
      url.searchParams.append("precoPor", `${name}`);
    }

    return {
      value: range!,
      label: range!,
      quantity: quantity!,
      selected,
      url: url.href,
    };
  }) ?? [],
});

export const toFilters = (
  aggregations: NonNullable<SearchQuery["result"]>["aggregations"],
  { base }: { base: URL },
): ProductListingPage["filters"] => {
  base.searchParams.delete("page");
  const filters: ProductListingPage["filters"] =
    aggregations?.filters?.map((filter) => toFilterItem(filter, base)) ?? [];

  if (aggregations?.priceRanges) {
    const pricefilter = toPriceFilter(aggregations?.priceRanges, base);

    filters.push(pricefilter);
  }

  if (aggregations?.maximumPrice && aggregations?.minimumPrice) {
    const priceRange: FilterRange = {
      "@type": "FilterRange" as const,
      key: "precoPor",
      label: "Preço",
      values: {
        max: aggregations.maximumPrice,
        min: aggregations.minimumPrice,
      },
    };

    filters.push(priceRange);
  }

  return filters;
};

export const toBreadcrumbList = (
  breadcrumbs: SingleProductFragment["breadcrumbs"] = [],
  { base: base }: { base: URL },
  product?: Product,
): BreadcrumbList => {
  const itemListElement = [
    ...(breadcrumbs ?? []).map(
      (item, i): ListItem<string> => ({
        "@type": "ListItem",
        name: item!.text!,
        position: i + 1,
        item: new URL(item!.link!, base).href,
      }),
    ),
  ];

  if (product) {
    itemListElement.push({
      "@type": "ListItem",
      name: product.isVariantOf?.name,
      item: product.isVariantOf?.url!,
      position: (breadcrumbs ?? []).length + 1,
    });
  }

  return {
    "@type": "BreadcrumbList",
    numberOfItems: itemListElement.length,
    itemListElement,
  };
};

export const toProduct = (
  variant: ProductFragment | SingleProductFragment,
  { base }: { base: URL | string },
  variants: Product[] = [],
  variantId?: number | null,
): Product => {
  const images = variant.images?.map((image) => ({
    "@type": "ImageObject" as const,
    encodingFormat: "image",
    url: image?.url ?? "",
    alternateName: image?.fileName ?? "",
  }));
  const additionalProperty: PropertyValue[] = [];
  const categoryProperty: CategoryValue[] = [];
  const variantsProperty: PropertyValueVariant[] = [];
  const offerSellers: OfferSellers[] = [];
  const buyBox: BuyBox | null = variant.buyBox
    ? {
      "@type": "PropertyValue",
      quantityOffers: variant.buyBox.quantityOffers ?? undefined,
      minimumPrice: variant.buyBox.minimumPrice ?? undefined,
      maximumPrice: variant.buyBox.maximumPrice,
      installments:
        variant.buyBox.installmentPlans?.[0]?.installments?.map((plan) => ({
          discount: plan?.discount,
          fees: plan?.fees,
          number: plan?.number,
          value: plan?.value,
        })) ?? undefined,
      seller: variant.buyBox?.sellers?.filter(
        (s): s is { name: string } => s !== null,
      ) ?? undefined,
    }
    : null;

  if ((variant as SingleProductFragment)?.attributeSelections) {
    (
      variant as SingleProductFragment
    )?.attributeSelections?.selections?.forEach((selection) => {
      if (selection?.name == "Outras Opções") {
        selection.values?.forEach((value) => {
          additionalProperty.push({
            "@type": "PropertyValue",
            url: value?.alias ?? undefined,
            value: value?.selected ? "true" : "false",
            name: value?.value ?? undefined,
            valueReference: "SELECTIONS",
          });
        });
      }
    });
  }

  if ((variant as SingleProductFragment)?.attributeSelections) {
    (
      variant as SingleProductFragment
    )?.attributeSelections?.selections?.forEach((selection) => {
      const values = selection?.values ?? [];
      if (values.length > 1 && selection?.name !== "Nome Variação") {
        values.forEach((value) => {
          variantsProperty.push({
            "@type": "PropertyValue",
            url: value?.alias ?? undefined,
            value: value?.selected ? "true" : "false",
            name: value?.value ?? undefined,
            selectionName: selection?.name ?? "Sem nome",
            available: value?.available,
            valueReference: "VARIANT",
          });
        });
      }
    });
  }

  // console.log(
  //   "variante no seller",
  //   variant?.attributeSelections?.selectedVariant
  // );

  if ((variant as SingleProductFragment)?.attributeSelections) {
    (
      variant as SingleProductFragment
    )?.attributeSelections?.selectedVariant?.offers?.forEach((offer) => {
      const installmentPlanSellers: UnitPriceSpecification[] = [];

      offer?.prices?.installmentPlans?.forEach((installmentPlan) => {
        if (installmentPlan) {
          installmentPlan.installments?.forEach((installment) => {
            installmentPlanSellers.push({
              "@type": "UnitPriceSpecification",
              priceType: "https://schema.org/SalePrice",
              priceComponentType: "https://schema.org/Installment",
              name: installmentPlan.displayName ?? undefined,
              billingDuration: installment?.number ?? undefined,
              billingIncrement: installment?.value ?? undefined,
              price: installment?.value ?? 0,
            });
          });
        }
      });

      if (offer) {
        offerSellers.push({
          "@type": "PropertyValue",
          name: offer?.name ?? undefined,
          productID: offer.productVariantId,
          price: offer?.prices?.price ?? 0,
          listPrice: offer?.prices?.listPrice ?? 0,
          priceSpecification: installmentPlanSellers,
          inventory: offer?.stock ?? 0,
          valueReference: "SELLERS",
        });
      }
    });
  }

  // console.log(variant.productCategories, "variant.productCategories");
  variant.productCategories?.forEach((category) =>
    categoryProperty.push({
      "@type": "PropertyValue" as const,
      name: "category",
      propertyID: String(category?.id) ?? "",
      value: category?.name ?? "",
      categorytype: category?.main,
      url: category?.url ?? "",
    })
  );

  variant.informations?.forEach((info) =>
    additionalProperty.push({
      "@type": "PropertyValue",
      name: info?.type ?? undefined,
      alternateName: info?.title ?? undefined,
      value: info?.value ?? undefined,
      valueReference: "INFORMATION",
    })
  );

  variant.attributes?.forEach((attr) =>
    additionalProperty.push({
      "@type": "PropertyValue",
      name: attr?.name ?? undefined,
      value: attr?.value ?? undefined,
      valueReference: "SPECIFICATION",
    })
  );

  if (variant.urlVideo) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "urlVideo",
      value: variant.urlVideo,
      valueReference: "PROPERTY",
    });
  }

  if (variant.promotions) {
    variant.promotions.map((promotion) => {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: promotion!.title ?? undefined,
        value: promotion!.content ?? undefined,
        identifier: promotion!.id,
        image: promotion!.fullStampUrl
          ? [
            {
              "@type": "ImageObject",
              encodingFormat: "image",
              url: promotion!.fullStampUrl,
            },
          ]
          : undefined,
        valueReference: "PROMOTION",
      });
    });
  }

  if ((variant as BuyList).kit) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "kit",
      value: String((variant as BuyList).kit),
      valueReference: "PROPERTY",
    });
  }

  if ((variant as BuyList).buyListId) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "buyListId",
      value: String((variant as BuyList).buyListId),
      valueReference: "PROPERTY",
    });
  }

  if (variant.collection) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "collection",
      value: variant.collection ?? undefined,
      valueReference: "COLLECTION",
    });
  }

  //   console.log(additionalProperty);

  const priceSpecification: UnitPriceSpecification[] = [];

  if (variant.prices?.listPrice) {
    priceSpecification.push({
      "@type": "UnitPriceSpecification",
      priceType: "https://schema.org/ListPrice",
      price: variant.prices.listPrice,
    });
  }
  if (variant.prices?.price) {
    priceSpecification.push({
      "@type": "UnitPriceSpecification",
      priceType: "https://schema.org/SalePrice",
      price: variant.prices.price,
    });
  }

  if (variant.prices?.installmentPlans) {
    variant.prices.installmentPlans.forEach((installmentPlan) => {
      if (installmentPlan) {
        installmentPlan.installments?.forEach((installment) => {
          priceSpecification.push({
            "@type": "UnitPriceSpecification",
            priceType: "https://schema.org/SalePrice",
            priceComponentType: "https://schema.org/Installment",
            name: installmentPlan.displayName ?? undefined,
            description: installmentPlan.name ?? undefined,
            billingDuration: installment?.number,
            billingIncrement: installment?.value,
            price: installment?.value,
          });
        });
      }
    });
  }

  const review = (variant as SingleProductFragment).reviews?.map((review) => ({
    "@type": "Review" as const,
    author: [
      {
        "@type": "Author" as const,
        name: review?.customer ?? undefined,
        identifier: review?.email ?? undefined,
      },
    ],
    datePublished: review?.reviewDate ?? undefined,
    reviewBody: review?.review ?? undefined,
    reviewRating: {
      "@type": "AggregateRating" as const,
      bestRating: 5,
      worstRating: 1,
      ratingValue: review?.rating ?? undefined,
      ratingCount: 1,
    },
  })) ?? [];

  const isSimilarTo = variant.similarProducts?.map((p) =>
    toProduct(p!, { base })
  );

  const variantSelected = variants.find((v) => {
    return Number(v.productID) === Number(variantId);
  }) ?? {};

  const aggregateRating =
    variant.numberOfVotes || (variant as SingleProductFragment).reviews?.length
      ? {
        "@type": "AggregateRating" as const,
        bestRating: 5,
        ratingCount: variant.numberOfVotes || undefined,
        ratingValue: variant.averageRating ?? undefined,
        reviewCount: (variant as SingleProductFragment).reviews?.length,
        worstRating: 1,
      }
      : undefined;

  return {
    "@type": "Product",
    gtin: variant.ean ?? undefined,
    sku: variant.sku!,
    description:
      variant.informations?.find((info) => info?.type === "Descrição")?.value ??
        undefined,
    productID: variant.productVariantId,
    name: variant.variantName ?? undefined,
    inProductGroupWithID: variant.productId,
    image: !images?.length ? [DEFAULT_IMAGE] : images,
    brand: {
      "@type": "Brand",
      name: variant.productBrand?.name ?? undefined,
      url: variant.productBrand?.alias
        ? new URL(`/${variant.productBrand.alias}`, base).href
        : undefined,
      logo: variant.productBrand?.fullUrlLogo ?? undefined,
    },
    offers: {
      "@type": "AggregateOffer",
      highPrice: variant.prices?.price,
      lowPrice: variant.prices?.price,
      priceCurrency: "BRL",
      offerCount: 1,
      offers: [
        {
          "@type": "Offer",
          seller: variant.seller?.name ?? undefined,
          price: variant.prices?.price,
          priceSpecification,
          itemCondition: CONDITIONS[variant.condition!],
          availability: variant.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          inventoryLevel: { value: variant.stock },
        },
      ],
    },
    additionalProperty,
    categoryProperty,
    variantsProperty,
    ...variantSelected,
    isSimilarTo,
    review,
    aggregateRating,
    isVariantOf: {
      "@type": "ProductGroup",
      name: variant.productName ?? undefined,
      productGroupID: variant.productId,
      hasVariant: variants,
      additionalProperty: [],
    },
    offerSellers,
    buyBox: buyBox,
  };
};
