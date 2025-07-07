import { Props } from "../islands/ProductData.tsx";

export function generateProductJsonLd({
  typePage,
  breadcrumb,
  productDataLeafLet,
  leafLetContent,
  productMainData,
  productMainContent,
  productVariantData,
  productVariantContent,
}: Props) {
  let jsonLd;

  switch (typePage) {
    case "ProductMain": {
      const product = productMainData;
      const productContent = productMainContent;
      const category = breadcrumb?.itemListElement
        .filter(({ name, item }) => name && item)
        ?.slice(0, -1)
        .map((item) => item.name)
        .join(" > ");

      const attributeValue = productContent?.productAttribute?.find(
        (attribute) => attribute.id === 33129,
      )?.value;

      const isMedication = productContent?.productType === 1 ||
        productContent?.productType === 1;

      if (!isMedication) {
        jsonLd = [
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "@id":
                  `https://consultaremedios.com.br/${productContent?.slug}/p`,
                name: product?.name != productContent?.metaTitle &&
                    productContent?.metaTitle != ""
                  ? productContent?.metaTitle
                  : product?.name,
                image: product?.image?.map((img) => {
                  return img.url;
                }),
                description: attributeValue
                  ? attributeValue?.replace(/<[^>]+>/g, "")
                  : productContent?.productAttribute
                    ?.find(
                      (attribute) =>
                        attribute.attribute.title == "Para que serve",
                    )
                    ?.value.replace(/<[^>]+>/g, ""),
                brand: {
                  "@type": "Brand",
                  name: product?.brand?.name,
                },
                sku: productContent?.variation?.map((variant) => {
                  return variant.ean;
                }),
                gtin13: productContent?.variation?.map((variant) => {
                  return variant.ean;
                }),
                category: category,
                offers: {
                  "@type": "Offer",
                  url:
                    `https://consultaremedios.com.br/${productContent?.slug}/p`,
                  price: product?.offers?.lowPrice,
                  priceCurrency: product?.offers?.priceCurrency,
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/InStock",
                },
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                position: 0,
                name: "Home",
                item: "https://consultaremedios.com.br",
              },
              ...breadcrumb?.itemListElement,
            ]
              .filter(({ name, item }) => name && item)
              .map((e, index, array) => {
                const isLastItem = index !== array.length - 1;

                return {
                  "@type": "ListItem",
                  position: e.position + 1,
                  name: e.name,
                  ...(isLastItem ? { item: e.item } : {
                    item:
                      `https://consultaremedios.com.br/${productContent?.slug}/p`,
                  }),
                };
              }),
          },
        ];
      } else {
        jsonLd = [
          {
            "@context": "https://schema.org/",
            "@type": "Drug",
            name: product?.name != productContent?.metaTitle &&
                productContent?.metaTitle != ""
              ? productContent?.metaTitle
              : product?.name,
            image: product?.image?.map((img) => {
              return img.url;
            }),
            url: `https://consultaremedios.com.br/${productContent?.slug}/p`,
            description: attributeValue
              ? attributeValue?.replace(/<[^>]+>/g, "")
              : productContent?.productAttribute
                ?.find(
                  (attribute) => attribute.attribute.title == "Para que serve",
                )
                ?.value.replace(/<[^>]+>/g, ""),
            activeIngredient: [
              {
                name: productContent.substance.substanceName,
                url: productContent.substance.slug
                  ? `https://consultaremedios.com.br/${productContent.substance?.slug}/pa`
                  : null,
              },
            ],
            dosageForm: product?.additionalProperty?.find(
              (attribute) => attribute.name == "Forma Farmacêutica",
            )?.value,
            prescriptionStatus:
              productContent?.prescriptionType.prescriptionTypeName ==
                  "Isento de Prescrição Médica"
                ? "OTC"
                : "PrescriptionOnly",
            isProprietary:
              productContent?.classification?.classificationName == "Genérico"
                ? false
                : true,
            isAvailableGenerically: productContent.hasGeneric,
            nonProprietaryName: productContent.substance.substanceName,
            indication: productContent?.productAttribute
              ?.find(
                (attribute) => attribute.attribute.title == "Para que serve",
              )
              ?.value.replace(/<[^>]+>/g, ""),
            contraindication: productContent?.productAttribute
              ?.find(
                (attribute) => attribute.attribute.title == "Contraindicação",
              )
              ?.value.replace(/<[^>]+>/g, ""),
            adverseOutcome: productContent?.productAttribute
              ?.find(
                (attribute) => attribute.attribute.title == "Reações Adversas",
              )
              ?.value.replace(/<[^>]+>/g, ""),
            overdosage: productContent?.productAttribute
              ?.find((attribute) => attribute.attribute.title == "Superdose")
              ?.value.replace(/<[^>]+>/g, ""),
            drugClass: productContent.therapeuticCLass.therapeuticClassName,
            category: category,
            manufacturer: productContent.factory.factoryName,
            gtin13: productContent?.variation?.map((variant) => {
              return variant.ean;
            }),
            sku: productContent?.variation?.map((variant) => {
              return variant.ean;
            }),
            offers: {
              "@type": "Offer",
              url: `https://consultaremedios.com.br/${productContent?.slug}/p`,
              price: product?.offers?.lowPrice,
              priceCurrency: product?.offers?.priceCurrency,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock",
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
              lastReviewed: productContent?.updated,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                position: 0,
                name: "Home",
                item: "https://consultaremedios.com.br",
              },
              ...breadcrumb?.itemListElement,
            ]
              .filter(({ name, item }) => name && item)
              .map((e, index, array) => {
                const isLastItem = index !== array.length - 1;

                return {
                  "@type": "ListItem",
                  position: e.position + 1,
                  name: e.name,
                  ...(isLastItem ? { item: e.item } : {
                    item:
                      `https://consultaremedios.com.br/${productContent?.slug}/p`,
                  }),
                };
              }),
          },
        ];
      }

      break;
    }

    case "ProductVariant": {
      const product = productVariantData;
      const productContent = productVariantContent;

      const category = breadcrumb?.itemListElement
        .filter(({ name, item }) => name && item)
        ?.slice(0, -2)
        .map((item) => item.name)
        .join(" > ");

      const attributeValue = productContent?.product?.productAttribute?.find(
        (attribute) => attribute.id === 33129,
      )?.value;

      const isMedication = productContent?.product?.productType === 1 ||
        productContent?.product?.productType === 1;

      if (!isMedication) {
        jsonLd = [
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "@id":
                  `https://consultaremedios.com.br/${productContent?.slug}/p`,
                name: product?.name != productContent?.product.metaTitle &&
                    productContent?.product.metaTitle != ""
                  ? productContent?.title
                  : product?.name,
                image: product?.image?.map((img) => {
                  return img.url;
                }),
                description: attributeValue
                  ? attributeValue?.replace(/<[^>]+>/g, "")
                  : productContent?.product?.productAttribute
                    ?.find(
                      (attribute) =>
                        attribute.attribute.title == "Para que serve",
                    )
                    ?.value.replace(/<[^>]+>/g, ""),
                brand: {
                  "@type": "Brand",
                  name: product?.brand?.name,
                },
                sku: [product?.sku],
                gtin13: [product?.gtin],
                category: category,
                offers: {
                  "@type": "Offer",
                  url:
                    `https://consultaremedios.com.br/${productContent?.slug}/p`,
                  price: product?.offers?.lowPrice,
                  priceCurrency: product?.offers?.priceCurrency,
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/InStock",
                },
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                position: 0,
                name: "Home",
                item: "https://consultaremedios.com.br",
              },
              ...breadcrumb?.itemListElement,
            ].map((e, index, array) => {
              const isLastItem = index !== array.length - 1;

              return {
                "@type": "ListItem",
                position: e.position + 1,
                name: e.name,
                ...(isLastItem ? { item: e.item } : {
                  item:
                    `https://consultaremedios.com.br/${productContent?.slug}/p`,
                }),
              };
            }),
          },
        ];
      } else {
        jsonLd = [
          {
            "@context": "https://schema.org/",
            "@type": "Drug",
            name: product?.name != productContent?.product.metaTitle &&
                productContent?.product.metaTitle != ""
              ? productContent.product.metaTitle
              : product?.name,
            image: product?.image?.map((img) => {
              return img.url;
            }),
            url: `https://consultaremedios.com.br/${productContent?.slug}/p`,
            description: attributeValue
              ? attributeValue?.replace(/<[^>]+>/g, "")
              : productContent?.product?.productAttribute
                ?.find(
                  (attribute) => attribute.attribute.title == "Para que serve",
                )
                ?.value.replace(/<[^>]+>/g, ""),
            activeIngredient: [
              {
                name: productContent.substance.substanceName,
                url: productContent.substance.slug
                  ? `https://consultaremedios.com.br/${productContent.substance?.slug}/pa`
                  : null,
              },
            ],
            dosageForm: product?.additionalProperty?.find(
              (attribute) => attribute.name == "Forma Farmacêutica",
            )?.value,
            prescriptionStatus:
              productContent?.prescriptionType.prescriptionTypeName ==
                  "Isento de Prescrição Médica"
                ? "OTC"
                : "PrescriptionOnly",
            isProprietary:
              productContent?.classification?.classificationName == "Genérico"
                ? false
                : true,
            isAvailableGenerically: productContent.product?.hasGeneric,
            nonProprietaryName: productContent.substance.substanceName,
            indication: productContent?.product?.productAttribute
              ?.find(
                (attribute) => attribute.attribute.title == "Para que serve",
              )
              ?.value.replace(/<[^>]+>/g, ""),
            contraindication: productContent?.product?.productAttribute
              ?.find(
                (attribute) => attribute.attribute.title == "Contraindicação",
              )
              ?.value.replace(/<[^>]+>/g, ""),
            adverseOutcome: productContent?.product?.productAttribute
              ?.find(
                (attribute) => attribute.attribute.title == "Reações Adversas",
              )
              ?.value.replace(/<[^>]+>/g, ""),
            overdosage: productContent?.product?.productAttribute
              ?.find((attribute) => attribute.attribute.title == "Superdose")
              ?.value.replace(/<[^>]+>/g, ""),
            drugClass:
              productContent.product.therapeuticCLass.therapeuticClassName,
            category: category,
            manufacturer: productContent.product.factory.factoryName,
            gtin13: [product?.gtin],
            sku: [product?.sku],
            offers: {
              "@type": "Offer",
              url: `https://consultaremedios.com.br/${productContent?.slug}/p`,
              price: product?.offers?.lowPrice,
              priceCurrency: product?.offers?.priceCurrency,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock",
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
              lastReviewed: productContent?.updated,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                position: 0,
                name: "Home",
                item: "https://consultaremedios.com.br",
              },
              ...breadcrumb?.itemListElement,
            ].map((e, index, array) => {
              const isLastItem = index !== array.length - 1;

              return {
                "@type": "ListItem",
                position: e.position + 1,
                name: e.name,
                ...(isLastItem ? { item: e.item } : {
                  item:
                    `https://consultaremedios.com.br/${productContent?.slug}/p`,
                }),
              };
            }),
          },
        ];
      }

      break;
    }
    case "OnlineStore": {
      jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "OnlineStore",
            "@id": "https://consultaremedios.com.br/#organization",
            name: "Consulta Remédios",
            legalName: "DROGARIAS ON LINE AGENCIAS DE FARMACIAS S.A",
            alternateName: "CR",
            url: "https://consultaremedios.com.br/",
            logo: {
              "@type": "ImageObject",
              url:
                "https://assets.decocache.com/consul-remedio/3e341ee9-6e93-468f-b76a-de4736f14d73/logo-cr.svg",
              width: 35,
              height: 35,
            },
            sameAs: [
              "https://www.facebook.com/consultaremedios",
              "https://www.instagram.com/consultaremediosoficial/",
              "https://www.linkedin.com/company/consultaremedios",
              "https://youtube.com/user/consultaremedios",
              "https://twitter.com/c_remedios",
              "https://www.tiktok.com/@consultaremedios",
              "https://br.pinterest.com/consultaremedios/",
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rua Desembargador Vieira Cavalcanti, 721",
              addressLocality: "Curitiba",
              addressRegion: "PR",
              addressCountry: "BR",
              postalCode: "80510-342",
            },
          },
          {
            "@type": "WebSite",
            "@id": "https://consultaremedios.com.br/#website",
            url: "https://consultaremedios.com.br/",
            name: "Consulta Remédios",
            publisher: {
              "@id": "https://consultaremedios.com.br/#organization",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://consultaremedios.com.br/b/{search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        ],
      };
      break;
    }
    case "ListItem":
      {
        jsonLd = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumb?.itemListElement.map(
              (e, index, array) => {
                const isLastItem = index !== array.length - 1;

                return {
                  "@type": "ListItem",
                  position: e.position,
                  name: e.name,
                  ...(isLastItem && { item: e.item }),
                };
              },
            ),
          },
        ];
      }

      break;

    case "MedicalWebPage": {
      const productContent = leafLetContent || productDataLeafLet;

      if (!productContent) break;
      const isProductVariation = "productId" in productContent!;
      const nameProduct = isProductVariation
        ? productContent.product?.title
        : productContent.title;
      jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: `Bula do ${nameProduct}}`,
          url: `https://consultaremedios.com.br/${productContent?.slug}/bula`,
          description:
            `Bula do ${nameProduct}, conteúdo extraído da Anvisa e organizado por tópicos. Veja para que serve o ${nameProduct}, como usar, preços e mais.`,
          publisher: {
            "@type": "Organization",
            name: "Consulta Remédios",
          },
          lastReviewed: productContent?.updated,
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
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              position: 0,
              name: "Home",
              item: "https://consultaremedios.com.br",
            },
            ...breadcrumb?.itemListElement,
          ].map((e, index, array) => {
            const isLastItem = index !== array.length - 1;

            return {
              "@type": "ListItem",
              position: e.position,
              name: e.name,
              ...(isLastItem && { item: e.item }),
            };
          }),
        },
      ];

      break;
    }
  }

  return JSON.stringify(jsonLd);
}
