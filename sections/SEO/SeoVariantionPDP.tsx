import Seo from "../../components/ui/Seo.tsx";
import {
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";
import {
  ProductAttribute,
  ProductCategory,
  ProductVariation,
} from "../../commerce/ContentTypes.ts";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import { getVariation } from "../../sdk/getVariation.ts";

export interface Props {
  /** @title Data Source */
  jsonLD: ProductDetailsPage | null;
  /** @title Product (nome do produto) */
  product?: RequestURLParam;
  /** @title Slug (da variação) */
  slug?: RequestURLParam;
  omitVariants?: boolean;
  /** @title Title Override */
  title?: string;
  /** @title Description Override */
  description?: string;
  /**
   * @title Disable indexing
   * @description In testing, you can use this to prevent search engines from indexing your site
   */
  noIndexing?: boolean;
  /**
   * @title Ignore Structured Data
   * @description By default, Structured Data is sent to everyone. Use this to prevent Structured Data from being sent to your customers, it will still be sent to crawlers and bots. Be aware that some integrations may not work if Structured Data is not sent.
   */
  ignoreStructuredData?: boolean;
}

interface ListItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item: string;
}

/**
 * Extrai product e slug de uma URL
 * @param url URL no formato dominio.com/[product]/[slug]/p
 */
function extractProductAndSlugFromURL(url: URL): {
  product?: string;
  slug?: string;
} {
  if (!url) return { product: undefined, slug: undefined };

  try {
    // Obter o pathname e remover barras iniciais e finais
    let path = url.pathname.replace(/^\/?/, "").replace(/\/?$/, "");

    // Remover o "/p" final se existir
    if (path.endsWith("/p")) {
      path = path.slice(0, -2);
    }

    // Dividir o caminho em segmentos
    const segments = path.split("/");

    // O primeiro segmento é o product, o resto é o slug
    if (segments.length >= 1) {
      const product = segments[0];
      const slug = segments.length > 1
        ? segments.slice(1).join("/")
        : undefined;

      return { product, slug };
    }
  } catch (error) {
    console.error("Erro ao extrair product e slug da URL:", error);
  }

  return { product: undefined, slug: undefined };
}

/** @title Product details PDP Variant */
export function loader(_props: Props, _req: Request, ctx: AppContext) {
  const props = _props as Partial<Props>;
  const {
    titleTemplate = "",
    descriptionTemplate = "",
    ...seoSiteProps
  } = ctx.seo ?? {};

  const { title: titleProp, description: descriptionProp, jsonLD } = props;

  // Resolver a URL para uso posterior
  const url = new URL(_req.url).pathname === "/live/invoke"
    ? new URL(_req.headers.get("referer") || _req.url)
    : new URL(_req.url);

  // Tentar usar os product e slug fornecidos, ou extrair da URL
  let { product, slug } = props;

  if (!product || !slug) {
    const extracted = extractProductAndSlugFromURL(url);

    // Usar os valores extraídos apenas se não foram fornecidos explicitamente
    product = product || (extracted.product as RequestURLParam);
    slug = slug || (extracted.slug as RequestURLParam);
  }

  // Valores iniciais para título e descrição
  let metaTitle = titleProp;
  let metaDescription = descriptionProp;

  // console.log("product", jsonLD);

  let seoData: unknown = [];

  // Se temos product e slug, buscar metadados adicionais da API
  if (product && slug) {
    try {
      const productData = jsonLD?.productContent;

      // console.log(productData);

      const isCategoryMedicine = productData?.product?.productCategory?.find(
        (category: ProductCategory) =>
          category.category?.path?.includes("Medicamentos"),
      );
      const categoryMain = productData?.product?.productCategory?.find(
        (category: ProductCategory) => category?.mainCategory,
      );

      if (productData) {
        // Extrair informações básicas do produto para uso no fallback
        const productNamefull = `${productData.product?.title || ""} ${
          productData?.title || ""
        }`;
        const productName = productData.product?.title || "";

        // Verificar se metaTitle e metaDescription existem na resposta da API
        const hasMetaTitle = productData.metaTitle &&
          productData.metaTitle.trim().length > 0;
        const hasMetaDescription = productData.metaDescription &&
          productData.metaDescription.trim().length > 0;

        // Se não tivermos um título personalizado nas props, verificar a API
        if (!titleProp) {
          if (hasMetaTitle) {
            // Usar metaTitle da API se estiver disponível
            metaTitle = productData.metaTitle;
          } else {
            // Fallback para o título se metaTitle estiver vazio na API
            metaTitle = isCategoryMedicine
              ? `Comprar ${productNamefull} | CR`
              : `Ofertas de ${productNamefull} | CR`;
          }
        }

        // Mesma lógica para descrição
        if (!descriptionProp) {
          if (hasMetaDescription) {
            // Usar metaDescription da API se estiver disponível
            metaDescription = productData.metaDescription;
          } else {
            // Fallback para a descrição se metaDescription estiver vazio na API
            metaDescription = isCategoryMedicine
              ? `${productNamefull} com menor preço e entrega rápida. Compre ${productName} online através da Consulta Remédios e economize!`
              : `Encontre ${productNamefull} com os menores preços na Consulta Remédios. Entre, compare e economize em ${categoryMain?.category?.categoryName}!`;
          }
        }

        const attributeValue = productData?.product?.productAttribute?.find(
          (attribute: ProductAttribute) => attribute.id === 33129,
        )?.value;
        const isMedication = productData?.product?.productType === 1;
        // console.log("name", isMedication);

        const category = jsonLD?.breadcrumbList?.itemListElement
          .filter(({ name, item }) => name && item)
          ?.slice(0, -1)
          .map((item) => item.name)
          .join(" > ");

        const newItems: ListItem[] = [
          {
            "@type": "ListItem",
            name: productData?.product?.substance.substanceName ?? "",
            position: 3,
            item: `${url.origin}/${productData?.product?.substance.slug}/pa`,
          },
          {
            "@type": "ListItem",
            name: productData?.product?.title ?? "",
            position: 4,
            item: `${url.origin}/${productData?.product?.slug}/p`,
          },
          {
            "@type": "ListItem",
            name: jsonLD?.product?.name?.replace(
              `${productData?.product?.title}`,
              "",
            ) ?? "",
            position: 5,
            item: url.href,
          },
        ];

        const breadcrumb = {
          ...jsonLD?.breadcrumbList,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: url.origin,
            },
            ...(jsonLD?.breadcrumbList?.itemListElement?.slice(0, -1) || []),
            ...newItems,
          ],
          numberOfItems: (jsonLD?.breadcrumbList?.numberOfItems ?? 0) - 1 +
            newItems.length,
        };

        const newBreadcrumb = breadcrumb?.itemListElement?.filter(
          ({ name, item }) => name && item,
        );

        const productVariantIdParams = url.searchParams.get("variant_id");

        const productOffer = productVariantIdParams
          ? jsonLD?.product?.offerSellers?.find(
            (offer) => offer.productID === Number(productVariantIdParams),
          )
          : null;

        seoData = isMedication
          ? [
            {
              "@context": "https://schema.org/",
              "@type": "Drug",
              name: productNamefull,
              image: jsonLD?.product?.image?.map((img) => {
                return img.url;
              }) || "",
              url: url.href,
              description: attributeValue
                ? attributeValue?.replace(/<[^>]+>/g, "")
                : productData?.product?.productAttribute
                  ?.find(
                    (attribute: ProductAttribute) =>
                      attribute.attribute.title == "Para que serve",
                  )
                  ?.value.replace(/<[^>]+>/g, ""),
              activeIngredient: [
                {
                  name: productData?.product?.substance?.substanceName,
                  url: productData?.product?.substance?.slug
                    ? `https://consultaremedios.com.br/${productData?.product?.substance?.slug}/pa`
                    : null,
                },
              ],
              dosageForm: jsonLD?.product?.additionalProperty?.find(
                (attribute) => attribute.name == "Forma Farmacêutica",
              )?.value,
              prescriptionStatus:
                productData?.product?.prescriptionType.prescriptionTypeName ==
                    "Isento de Prescrição Médica"
                  ? "OTC"
                  : "PrescriptionOnly",
              isProprietary:
                productData?.product?.classification?.classificationName ==
                    "Genérico"
                  ? false
                  : true,
              isAvailableGenerically: productData?.product?.hasGeneric,
              nonProprietaryName: productData?.product?.substance.substanceName,
              indication: productData?.product?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Para que serve",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              contraindication: productData?.product?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Contraindicação",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              adverseOutcome: productData?.product?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Reações Adversas",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              overdosage: productData?.product?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Superdose",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              drugClass: productData?.product?.therapeuticCLass
                ?.therapeuticClassName,
              category: category,
              manufacturer: productData?.product?.factory?.commercialName,
              gtin13: productData?.ean,
              offers: jsonLD?.product?.buyBox?.minimumPrice !== 0.01
                ? productOffer
                  ? {
                    "@type": "Offer",
                    url: url.href,
                    price: productOffer.price,
                    priceCurrency: "BRL",
                    itemCondition: "https://schema.org/NewCondition",
                    availability: "https://schema.org/InStock",
                  }
                  : !productVariantIdParams
                  ? {
                    "@type": "Offer",
                    url: url.href,
                    price: jsonLD?.product?.buyBox?.minimumPrice,
                    priceCurrency: "BRL",
                    itemCondition: "https://schema.org/NewCondition",
                    availability: "https://schema.org/InStock",
                  }
                  : {
                    "@type": "Offer",
                    url: url.href,
                    price: jsonLD?.product?.buyBox?.minimumPrice,
                    priceCurrency: "BRL",
                    itemCondition: "https://schema.org/NewCondition",
                    availability: "https://schema.org/OutOfStock",
                  }
                : {
                  "@type": "Offer",
                  url: url.href,
                  price: jsonLD?.product?.buyBox?.minimumPrice,
                  priceCurrency: "BRL",
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/OutOfStock",
                },
              reviewedBy: {
                "@id":
                  "https://consultaremedios.com.br/editorial/equipe/karime-halmenschlager-sleiman",
                "@type": "Person",
                name: "Karime Halmenschlager Sleiman (CRF-PR 39421)",
                description:
                  "Farmacêutica generalista graduada pela Faculdade Paranaense e responsável técnica da Consulta Remédios, Farmácia Online.",
                jobTitle: "Farmacêutica Responsável",
                affiliation: {
                  "@type": "Organization",
                  name: "Faculdade Paranaense",
                },
                lastReviewed: productData?.product?.updated,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: newBreadcrumb?.map(
                (item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: item.name,
                  item: item.item,
                } as ListItem),
              ) || [],
            },
          ]
          : [
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Product",
                  "@id": `${url.href}`,
                  name: productNamefull,
                  image: jsonLD?.product?.image?.map((img) => {
                    return img.url;
                  }),
                  description: attributeValue
                    ? attributeValue?.replace(/<[^>]+>/g, "")
                    : productData?.product?.productAttribute
                      ?.find(
                        (attribute: ProductAttribute) =>
                          attribute.attribute.title == "Para que serve",
                      )
                      ?.value.replace(/<[^>]+>/g, ""),
                  brand: {
                    "@type": "Brand",
                    name: productData?.brand?.brandName,
                  },
                  gtin13: productData?.ean,
                  category: category,
                  offers: jsonLD?.product?.buyBox?.minimumPrice !== 0.01
                    ? {
                      "@type": "Offer",
                      url: url.href,
                      price: jsonLD?.product?.buyBox?.minimumPrice,
                      priceCurrency: "BRL",
                      itemCondition: "https://schema.org/NewCondition",
                      availability: "https://schema.org/InStock",
                    }
                    : {
                      "@type": "Offer",
                      url: url.href,
                      price: jsonLD?.product?.buyBox?.minimumPrice,
                      priceCurrency: "BRL",
                      itemCondition: "https://schema.org/NewCondition",
                      availability: "https://schema.org/OutOfStock",
                    },
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: newBreadcrumb?.map(
                (item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: item.name,
                  item: item.item,
                } as ListItem),
              ) || [],
            },
          ];
      }
    } catch (error) {
      console.error("Erro ao buscar metadados adicionais:", error);
    }
  }

  // Aplicar os templates usando os valores determinados
  const title = renderTemplateString(
    (titleTemplate ?? "").trim().length === 0 ? "%s" : titleTemplate,
    metaTitle || jsonLD?.seo?.title || ctx.seo?.title || "",
  );

  const description = renderTemplateString(
    (descriptionTemplate ?? "").trim().length === 0
      ? "%s"
      : descriptionTemplate,
    metaDescription || jsonLD?.seo?.description || ctx.seo?.description || "",
  );

  // Usar a URL da requisição como canônica
  const page = url.searchParams.get("pagina") || url.searchParams.get("pagina");

  const canonical = page
    ? `${url.origin}${url.pathname}`
    : `${url.origin}${url.pathname}`;

  // console.log("product", jsonLD?.product?.buyBox);

  // Preparar options para o componente Seo
  const seoOptions = {
    ...seoSiteProps,
    title,
    description,
    canonical,
    jsonLDs: seoData,
    noIndexing: jsonLD?.product ? false : true,
    // noIndexing: true,
  };

  return seoOptions;
}

function Section(props: Props): SEOSection {
  return <Seo {...props} />;
}

export function LoadingFallback(props: Partial<Props>) {
  return <Seo {...props} />;
}

export { default as Preview } from "apps/website/components/_seo/Preview.tsx";

export default Section;
