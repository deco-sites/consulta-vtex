import Seo from "../../components/ui/Seo.tsx";
import {
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";
import { DetailsPageLeaflet } from "../../commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";

export interface Props {
  /** @title Data Source */
  jsonLD: DetailsPageLeaflet | null;
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
 * Extrai product de uma URL de bula
 * @param url URL no formato dominio.com/[product]/bula
 */
function extractProductFromLeafletURL(url: URL): { product?: string } {
  if (!url) return { product: undefined };

  try {
    // Obter o pathname e remover barras iniciais e finais
    let path = url.pathname.replace(/^\/?/, "").replace(/\/?$/, "");

    // Verificar se a URL termina com /bula e extrair o product
    if (path.endsWith("/bula")) {
      path = path.slice(0, -5); // Remove "/bula"
    }

    // O caminho restante é o product
    return { product: path || undefined };
  } catch (error) {
    console.error("Erro ao extrair product da URL de bula:", error);
  }

  return { product: undefined };
}

/** @title Product details leaflet */
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

  let seoData: unknown = [];

  // Tentar usar o product fornecido, ou extrair da URL
  let { product } = props;

  console.log("product params", product);

  if (!product) {
    const extracted = extractProductFromLeafletURL(url);

    // Usar o valor extraído apenas se não foi fornecido explicitamente
    product = product || (extracted.product as RequestURLParam);
  }

  // Valores iniciais para título e descrição
  let metaTitle = titleProp;
  let metaDescription = descriptionProp;
  let isPage = false;

  // Se temos product, buscar metadados adicionais da API
  if (product) {
    try {
      const productData = jsonLD?.productMainContent;
      const substance = jsonLD?.productMainContent?.substance;
      isPage = !!productData?.title || !!substance?.substanceName;

      if (productData || substance) {
        // Extrair informações básicas do produto para uso no fallback
        const productName = substance?.substanceName ?? productData?.title ??
          "";

        // Verificar se metaTitleLeaflet e metaDescriptionLeaflet existem na resposta da API
        const hasMetaTitleLeaflet = (productData?.metaTitleLeaflet &&
          productData?.metaTitleLeaflet.trim().length > 0) ||
          substance?.metaTitleBula;
        const hasMetaDescriptionLeaflet =
          (productData?.metaDescriptionLeaflet &&
            productData?.metaDescriptionLeaflet.trim().length > 0) ||
          substance?.metaDescriptionBula;

        // Se não tivermos um título personalizado nas props, verificar a API
        if (!titleProp) {
          if (hasMetaTitleLeaflet) {
            // Usar metaTitleLeaflet da API se estiver disponível
            metaTitle = substance?.metaTitleBula ??
              productData?.metaTitleLeaflet ?? "";
          } else {
            // Fallback para o título se metaTitleLeaflet estiver vazio na API
            metaTitle = `${productName}: bula, para que serve e como usar | CR`;
          }
        }

        // Mesma lógica para descrição
        if (!descriptionProp) {
          if (hasMetaDescriptionLeaflet) {
            // Usar metaDescriptionLeaflet da API se estiver disponível
            metaDescription = substance?.metaDescriptionBula ??
              productData?.metaDescriptionLeaflet ??
              "";
          } else {
            // Fallback para a descrição se metaDescriptionLeaflet estiver vazio na API
            metaDescription =
              `Bula do ${productName}, conteúdo extraído da Anvisa e organizado por tópicos. Veja para que serve o ${productName}, como usar, preços e mais.`;
          }
        }

        const newItems: ListItem[] = [
          {
            "@type": "ListItem",
            name: productData?.substance?.substanceName ?? "",
            position: 3,
            item: `${url.origin}/${
              productData?.substance?.slug ?? productData?.slug
            }/pa`,
          },
          {
            "@type": "ListItem",
            name: productData?.slug ? productData?.title ?? "" : "",
            position: 4,
            item: `${url.origin}/${
              productData?.slug ?? productData?.substance?.slug
            }/p`,
          },
          {
            "@type": "ListItem",
            name: "Bula",
            position: 5,
            item: `${url.origin}/${
              productData?.slug ?? productData?.substance?.slug
            }/bula`,
          },
        ];

        const breadcrumb = productData?.slug
          ? {
            ...jsonLD?.breadcrumbList,
            itemListElement: [
              {
                "@type": "ListItem",
                name: "Home",
                position: 1,
                item: `/`,
              },
              ...(jsonLD?.breadcrumbList?.itemListElement.slice(0, -1) || []),
              ...newItems,
            ],
            numberOfItems: (jsonLD?.breadcrumbList?.numberOfItems ?? 0) +
              newItems.length,
          }
          : {
            itemListElement: [
              {
                "@type": "ListItem",
                name: "Home",
                position: 1,
                item: `/`,
              },
              ...newItems,
            ],
          };

        const newBreadcrumb = breadcrumb?.itemListElement?.filter(
          ({ name, item }) => name && item,
        );

        seoData = [
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: `Bula do ${productName}`,
            url: `https://consultaremedios.com.br/${
              substance?.slug ?? productData?.slug
            }/bula`,
            description:
              `Bula do ${productName}, conteúdo extraído da Anvisa e organizado por tópicos. Veja para que serve o ${productName}, como usar, preços e mais.`,
            publisher: {
              "@type": "Organization",
              name: "Consulta Remédios",
            },
            lastReviewed: substance?.updated ?? productData?.updated,
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
      console.error("Erro ao buscar metadados adicionais para bula:", error);
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

  const page = url.searchParams.get("pagina") || url.searchParams.get("pagina");
  // Usar a URL da requisição como canônica
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
    noIndexing: isPage ? false : true,
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
