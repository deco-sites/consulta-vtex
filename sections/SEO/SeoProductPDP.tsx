import Seo from "../../components/ui/Seo.tsx";
import {
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";
import { ProductDetailsPage } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import { getProduct } from "../../sdk/getProduct.ts";
import {
  ProductAttribute,
  ProductCategory,
  ProductVariation,
} from "../../commerce/ContentTypes.ts";

export interface Props {
  /** @title Data Source */
  jsonLD: ProductDetailsPage | null;
  /** @title Product (nome do produto) */
  product?: RequestURLParam;
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
 * Extrai product de uma URL
 * @param url URL no formato dominio.com/[product]/p
 */
function extractProductFromURL(url: URL): { product?: string } {
  if (!url) return { product: undefined };

  try {
    // Obter o pathname e remover barras iniciais e finais
    let path = url.pathname.replace(/^\/?/, "").replace(/\/?$/, "");

    // Remover o "/p" final se existir
    if (path.endsWith("/p")) {
      path = path.slice(0, -2);
    }

    // O caminho completo é o product
    return { product: path || undefined };
  } catch (error) {
    console.error("Erro ao extrair product da URL:", error);
  }

  return { product: undefined };
}

/** @title Product details PDP */
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

  // Tentar usar o product fornecido, ou extrair da URL
  let { product } = props;

  if (!product) {
    const extracted = extractProductFromURL(url);

    // Usar o valor extraído apenas se não foi fornecido explicitamente
    product = product || (extracted.product as RequestURLParam);
  }

  // Valores iniciais para título e descrição
  let metaTitle = titleProp;
  let metaDescription = descriptionProp;

  // console.log("product", jsonLD?.product.buyBox);

  let seoData: unknown = [];

  // Se temos product, buscar metadados adicionais da API

  if (product) {
    try {
      const productData = jsonLD?.productMainContent;

      if (productData) {
        const isCategoryMedicine = productData?.productCategory?.find(
          (category: ProductCategory) =>
            category.category?.path?.includes("Medicamentos"),
        );

        const categoryMain = productData?.productCategory?.find(
          (category: ProductCategory) => category?.mainCategory,
        );

        // console.log("categoryMain", categoryMain);
        // Extrair informações básicas do produto para uso no fallback
        const productName = productData.title || "";

        // Verificar se metaTitle e metaDescription existem na resposta da API
        const hasMetaTitle = productData.metaTitle &&
          productData.metaTitle.trim().length > 0;
        const hasMetaDescription = productData.metaDescription &&
          productData.metaDescription.trim().length > 0;

        const isHaveParentProducts = jsonLD?.parentProducts
          ?.filter(
            (product) =>
              product?.additionalProperty?.find(
                (property) => property.name === "Spot" && property.value,
              )?.value,
          )
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.name === value.name),
          );

        // Se não tivermos um título personalizado nas props, verificar a API
        if (!titleProp) {
          if (hasMetaTitle) {
            // Usar metaTitle da API se estiver disponível
            metaTitle = productData.metaTitle;
          } else {
            // Fallback para o título se metaTitle estiver vazio na API
            metaTitle = isCategoryMedicine
              ? (isHaveParentProducts?.length ?? 0) > 1
                ? `${productName} com menor preço e entrega rápida, compre online | CR`
                : `Comprar ${jsonLD?.product?.name} | CR`
              : (isHaveParentProducts?.length ?? 0) > 1
              ? `${productName} com menor preço | CR`
              : `Ofertas de ${jsonLD?.product?.name} | CR`;
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
              ? (isHaveParentProducts?.length ?? 0) > 1
                ? `${productName} com menor preço e entrega rápida. Compre ${productName} online e outros medicamentos através da Consulta Remédios e economize na farmácia!`
                : `${jsonLD?.product?.name} com menor preço e entrega rápida. Compre ${productName} online através da Consulta Remédios e economize!`
              : (isHaveParentProducts?.length ?? 0) > 1
              ? `Encontre ${productName} com os Melhores Preços. ${categoryMain?.category?.categoryName} com diversas ofertas para você economizar!`
              : `Encontre ${jsonLD?.product?.name} com os menores preços na Consulta Remédios. Entre, compare e economize em ${categoryMain?.category?.categoryName}!
`;
          }
        }

        const attributeValue = productData?.productAttribute?.find(
          (attribute: ProductAttribute) => attribute.id === 33129,
        )?.value;
        const isMedication = productData?.productType === 1 ||
          productData?.productType === 1;
        // console.log("name", isMedication);

        const category = jsonLD?.breadcrumbList?.itemListElement
          .filter(({ name, item }) => name && item)
          ?.slice(0, -1)
          .map((item) => item.name)
          .join(" > ");
        const slugInformation = jsonLD?.product?.additionalProperty?.find(
          (item) => item.name == "Spot",
        )?.value;

        const newItems: ListItem[] = [
          {
            "@type": "ListItem",
            name: productData?.substance?.substanceName ?? "",
            position: 3,
            item: `${url.origin}/${productData?.substance.slug}/pa`,
          },
          {
            "@type": "ListItem",
            name: jsonLD?.product?.isVariantOf?.name ?? "",
            position: 4,
            item: `${url.origin}/${productData?.slug}/p`,
          },
          {
            "@type": "ListItem",
            name: jsonLD?.product?.name?.replace(
              `${jsonLD?.product?.isVariantOf?.name}`,
              "",
            ) ?? "",
            position: 5,
            item: (isHaveParentProducts?.length ?? 0) > 0
              ? ""
              : `${url.origin}${
                slugInformation?.replace(
                  "https://consultaremedios.com.br",
                  "",
                )
              }`,
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

        seoData = isMedication
          ? [
            {
              "@context": "https://schema.org/",
              "@type": "Drug",
              name: productName,
              image: jsonLD?.product?.image?.map((img) => {
                return img.url;
              }) || "",
              url: url.href,
              description: attributeValue
                ? attributeValue?.replace(/<[^>]+>/g, "")
                : productData?.productAttribute
                  ?.find(
                    (attribute: ProductAttribute) =>
                      attribute.attribute.title == "Para que serve",
                  )
                  ?.value.replace(/<[^>]+>/g, ""),
              activeIngredient: [
                {
                  name: productData?.substance?.substanceName,
                  url: productData?.substance?.slug
                    ? `https://consultaremedios.com.br/${productData?.substance?.slug}/pa`
                    : null,
                },
              ],
              dosageForm: jsonLD?.product?.additionalProperty?.find(
                (attribute) => attribute.name == "Forma Farmacêutica",
              )?.value,
              prescriptionStatus:
                productData?.prescriptionType.prescriptionTypeName ==
                    "Isento de Prescrição Médica"
                  ? "OTC"
                  : "PrescriptionOnly",
              isProprietary:
                productData?.classification?.classificationName == "Genérico"
                  ? false
                  : true,
              isAvailableGenerically: productData?.hasGeneric,
              nonProprietaryName: productData?.substance.substanceName,
              indication: productData?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Para que serve",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              contraindication: productData?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Contraindicação",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              adverseOutcome: productData?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Reações Adversas",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              overdosage: productData?.productAttribute
                ?.find(
                  (attribute: ProductAttribute) =>
                    attribute.attribute.title == "Superdose",
                )
                ?.value.replace(/<[^>]+>/g, ""),
              drugClass: productData?.therapeuticCLass?.therapeuticClassName,
              category: category,
              manufacturer: productData?.factory?.commercialName,
              gtin13: productData?.variation
                ?.filter((item: ProductVariation) => item.ean.length === 13)
                ?.map((variant: ProductVariation) => {
                  return variant.ean;
                }),
              sku: productData?.variation
                ?.filter((item: ProductVariation) => item.ean.length !== 13)
                ?.map((variant: ProductVariation) => {
                  return variant.ean;
                }),
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
                lastReviewed: productData?.updated,
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
                  name: jsonLD?.product?.name != productData?.metaTitle &&
                      productData?.metaTitle != ""
                    ? productData?.title
                    : jsonLD?.product?.name,
                  image: jsonLD?.product?.image?.map((img) => {
                    return img.url;
                  }),
                  description: attributeValue
                    ? attributeValue?.replace(/<[^>]+>/g, "")
                    : productData?.description?.replace(/<[^>]+>/g, "") ?? "",
                  brand: {
                    "@type": "Brand",
                    name: productData?.brand?.brandName,
                  },
                  sku: productData?.variation
                    ?.filter(
                      (item: ProductVariation) => item.ean.length !== 13,
                    )
                    ?.map((variant: ProductVariation) => {
                      return variant.ean;
                    }),
                  gtin13: productData?.variation
                    ?.filter(
                      (item: ProductVariation) => item.ean.length === 13,
                    )
                    ?.map((variant: ProductVariation) => {
                      return variant.ean;
                    }),
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
    ? `${url.origin}${url.pathname}?pagina=${page}`
    : `${url.origin}${url.pathname}`;

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
