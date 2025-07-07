// LeafletDetails.tsx - Modificado para incluir apenas "Ação da Substância"
import { Product, ProductVariation } from "../../commerce/ContentTypes.ts";
import { OrderType } from "deco-sites/consul-remedio/components/bula/LeafletDetails.tsx";

interface LeafletDetailsProps {
  contentPage: Product | ProductVariation | null;
}

export function LeafletDetails({ contentPage }: LeafletDetailsProps) {
  if (!contentPage) return null;

  // Determine if contentPage is a Product or ProductVariation
  const isProductVariation = "productId" in contentPage;

  // Extract substance (active ingredient) and its slug
  const substanceName = isProductVariation
    ? contentPage.product?.substance?.substanceName
    : contentPage.substance?.substanceName;

  const substanceSlug = isProductVariation
    ? contentPage.product?.substance?.slug
    : contentPage.substance?.slug;

  // Access product attributes based on the type
  const productAttributes = isProductVariation
    ? contentPage.product?.productAttribute
    : contentPage.productAttribute ?? contentPage.substance.substanceAttribute;

  // Access substance attributes based on the type
  const substance = isProductVariation
    ? contentPage.product?.substance
    : contentPage.substance;

  // Filtrar apenas o atributo "Ação da Substância" dos atributos da substância
  const substanceActionAttribute = substance?.substanceAttribute
    ?.filter(
      (attr) =>
        attr.attribute?.title === "Ação da Substância" ||
        attr.attributeId === 16,
    )
    .map((sa) => ({
      id: sa.id,
      productId: null,
      attributeId: sa.attributeId,
      attribute: sa.attribute,
      attributeValueId: sa.attributeValueId,
      attributeValue: null,
      value: sa.value,
    })) || [];

  // Combine product attributes and the "Ação da Substância" attribute
  const combinedAttributes = [
    ...(productAttributes || []),
    ...substanceActionAttribute,
  ];

  // Filter only visible attributes and sort by the "sort" attribute
  const visibleAttributes = combinedAttributes
    .filter(
      (attr) => !attr.attribute?.hidden && attr.value && attr.attribute?.title,
    )
    .sort((a, b) => {
      // Ordenar pelo valor de sort
      return (a.attribute?.sort || 0) - (b.attribute?.sort || 0);
    });

  const hasVisibleAttributes = !!visibleAttributes &&
    visibleAttributes.length > 0;

  // Don't render anything if there are no visible attributes
  if (!hasVisibleAttributes) return null;

  // Use title directly from product or from the variation's product
  const productTitle = isProductVariation
    ? contentPage.product?.title
    : contentPage.title ?? contentPage?.substance?.substanceName;

  const disease = contentPage?.disease ?? contentPage?.substance?.disease;

  const isoDate = contentPage?.updated ?? contentPage?.substance?.updated;
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("pt-BR", options);

  const leafletSubstance = contentPage?.slug ? false : true;

  const order = {
    "Para que serve": 1,
    Contraindicação: 2,
    "Como usar": 3,
    Precauções: 8,
    Superdose: 5,
    Riscos: 6,
    "Reações Adversas": 4,
    "Interação Medicamentosa": 7,
    "Interação Alimentícia": 10,
    "Ação da Substância": 9,
    "Fontes consultadas": 11,
  };

  if (leafletSubstance) {
    visibleAttributes.forEach((attr) => {
      if (order[attr.attribute.title as keyof OrderType]) {
        attr.attribute.sort = order[attr.attribute.title as keyof OrderType];
      }
    });
  }

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1366px] px-4 mx-auto lg:px-10">
      <div className="leaflet-article lg:col-span-2">
        <div style={{ height: "100px" }}>
          <div
            data-premium=""
            data-adunit="CONSULTA_REMEDIOS_BULA_TOPO_DESKTOP"
            data-sizes-desktop="[[728,90]]"
          >
          </div>
          <div
            data-premium=""
            data-adunit="CONSULTA_REMEDIOS_BULA_TOPO_MOBILE"
            data-sizes-mobile="[[320,50]]"
          >
          </div>
        </div>

        {visibleAttributes
          ?.sort((a, b) => (a.attribute?.sort || 0) - (b.attribute?.sort || 0))
          .map((attr, index) => {
            // Check if it's HTML
            const isHtml = attr.value &&
              attr.value.includes("<") &&
              attr.value.includes(">");

            // Get section ID for navigation
            const sectionId = attr.attribute?.anchor || `section-${attr.id}`;

            return (
              <div key={index} id={sectionId} class="mb-8 leaflet-section">
                <h2 class="text-[#212529] text-3xl font-medium font-['Inter'] leading-[30px] mb-4">
                  {attr.attribute?.customerTitle?.replace(
                    "{name}",
                    productTitle || "",
                  ) || attr.attribute?.title}
                </h2>

                <div class="mt-2">
                  {isHtml
                    ? (
                      <div
                        class="prose max-w-none text-[#212529] text-lg font-normal font-['Inter'] leading-[27px]"
                        dangerouslySetInnerHTML={{ __html: attr.value }}
                      />
                    )
                    : (
                      <p class="text-[#212529] text-lg font-normal font-['Inter'] leading-[27px]">
                        {attr.value}
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        {disease && disease.length > 0 && (
          <div id={"doencas-relacionadas"} class="mb-8 leaflet-section">
            <h2 class="text-[#212529] text-3xl font-medium  leading-[30px] mb-4">
              Doenças relacionadas
            </h2>

            <div class="mt-2 flex flex-wrap gap-2">
              {disease?.map((item, index) => (
                <>
                  <a
                    class="text-primary hover:underline duration-200"
                    key={index}
                    href={`/doenca/${item.slug}`}
                  >
                    {item.diseaseName}
                    <span class="text-black">
                      {index < disease.length - 1 && ", "}
                    </span>
                  </a>
                </>
              ))}
            </div>
          </div>
        )}

        {/* Links for leaflets at the end of the section */}

        <div class="p-3">
          <div class="flex items-center ">
            <span class="text-sm text-gray-600 flex gap-1 items-center">
              <img
                class="mr-1 rounded-full"
                src="https://assets.decocache.com/consul-remedio/e71adc0a-64bf-43dd-95ad-24bd3d7d3348/karine-sleiman.webp"
                alt="Karime Halmenschlager Sleiman"
                width="32"
                height="32"
                data-mce-src="https://assets.decocache.com/consul-remedio/e71adc0a-64bf-43dd-95ad-24bd3d7d3348/karine-sleiman.webp"
              />{" "}
              <div>
                Revisado clinicamente por:{" "}
                <a
                  class="underline"
                  href="/editorial/equipe/karime-halmenschlager-sleiman"
                  data-mce-href="/editorial/equipe/karime-halmenschlager-sleiman"
                >
                  Karime Halmenschlager Sleiman.
                </a>
                Atualizado em:{" "}
                {formattedDate.replace(/de (\w+)/, (_match, month) => {
                  return "de " + month.charAt(0).toUpperCase() + month.slice(1);
                })}
                .
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeafletDetails;
