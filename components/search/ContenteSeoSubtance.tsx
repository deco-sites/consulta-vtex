import { AttributeSubstance } from "../../commerce/attributesTypes.ts";
import { PrescriptionType } from "deco-sites/consul-remedio/commerce/ContentTypes.ts";
import { OrderType } from "deco-sites/consul-remedio/components/bula/LeafletDetails.tsx";
interface Props {
  contentSeoSubtance: AttributeSubstance;
  prescription: PrescriptionType | null | undefined;
}

function ContenteSeoSubtance({ contentSeoSubtance, prescription }: Props) {
  const renderCustomerTitle = (customerTitle: string, name: string): string => {
    return customerTitle?.replace("{name}", name);
  };

  const attributes = contentSeoSubtance?.substanceAttribute
    ?.filter(
      (item, index, self) =>
        index ===
          self.findIndex(
            (t) =>
              t.attribute?.title === item.attribute?.title &&
              item.attribute?.title,
          ),
    )
    ?.sort((a, b) => (a.attribute?.sort || 0) - (b.attribute?.sort || 0));

  const genericProducts = contentSeoSubtance?.genericProducts?.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.name === item.name),
  );

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
    "Fontes consultadas": 12,
  };

  attributes.forEach((attr) => {
    if (order[attr.attribute.title as keyof OrderType]) {
      attr.attribute.sort = order[attr.attribute.title as keyof OrderType];
    }
  });

  return (
    <section id="bula" className="content-seo">
      <h2>Bula do {contentSeoSubtance?.nameSubstance}</h2>
      <div class="flex flex-col">
        {attributes
          ?.sort((a, b) => (a.attribute?.sort || 0) - (b.attribute?.sort || 0))
          ?.map((substance, index) => {
            if (
              substance.attribute.customerTitle ==
                "Quais as contraindicações do {name}?"
            ) {
              return (
                <>
                  <div
                    style={{ order: substance.attribute.sort }}
                    class={`order-${substance.attribute.sort}`}
                  >
                    <h2 class="mb-5">
                      {renderCustomerTitle(
                        substance.attribute.customerTitle,
                        contentSeoSubtance?.nameSubstance,
                      )}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: substance.value }}
                    >
                    </div>
                  </div>
                  {prescription && (
                    <div
                      style={{ order: substance.attribute.sort }}
                      class={`order-${substance.attribute.sort}`}
                    >
                      <h2 class="mb-5">Tipo de receita</h2>
                      <div>{prescription?.prescriptionTypeName}</div>
                    </div>
                  )}
                </>
              );
            } else {
              return (
                <div
                  style={{ order: substance.attribute.sort }}
                  class={`order-${substance.attribute.sort}`}
                >
                  <h2 class="mb-5">
                    {renderCustomerTitle(
                      substance.attribute.customerTitle,
                      contentSeoSubtance?.nameSubstance,
                    )}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: substance.value }}
                  >
                  </div>
                </div>
              );
            }
          })}
        {contentSeoSubtance?.dcb && (
          <div
            style={{ order: 11 }}
            class={`pb-4 border-y border-gray-300  order-${
              attributes.length - 1
            }`}
          >
            <h2 class="mb-0">DCB (Denominação Comum Brasileira)</h2>
            <div class="flex flex-wrap gap-2">
              <p>{contentSeoSubtance?.dcb}</p>
            </div>
          </div>
        )}
        {contentSeoSubtance?.genericProducts && (
          <div
            style={{ order: 13 }}
            class={`pb-4 border-t border-gray-300  order-${13}`}
          >
            <h2 class="mb-0">Nomes comerciais</h2>
            <div class="flex flex-wrap gap-2">
              {genericProducts?.map((item, index) => {
                const slugHref = item?.href.split("/")[3];
                return (
                  <a
                    class="text-primar no-underline hover:underline hover:text-black"
                    href={`/${slugHref}/p`}
                  >
                    {item?.name}
                    {index === (genericProducts?.length ?? 0) - 1 ? "" : ","}
                  </a>
                );
              })}
            </div>
          </div>
        )}
        {(contentSeoSubtance?.disease?.length ?? 0) > 0 && (
          <div
            style={{ order: 14 }}
            class={`pb-4 border-t border-gray-300  order-${14}`}
          >
            <h2 class="mb-0">Doenças relacionadas</h2>
            <div class="flex flex-wrap gap-2">
              {contentSeoSubtance?.disease?.map((item, index) => (
                <a
                  class="text-primar no-underline hover:underline hover:text-black"
                  href={`/doenca/${item?.slug}`}
                >
                  {item?.diseaseName}
                  {index === (contentSeoSubtance?.disease?.length ?? 0) - 1
                    ? ""
                    : ","}
                </a>
              ))}
            </div>
          </div>
        )}
        {(contentSeoSubtance?.medicalSpecialty?.length ?? 0) > 0 && (
          <div
            style={{ order: 15 }}
            class={`pb-4 border-t border-gray-300 order-${15}`}
          >
            <h2 class="mb-0">Especialidades Médicas</h2>
            {contentSeoSubtance?.medicalSpecialty?.map((item) => (
              <p>{item?.medicalSpecialtyName}</p>
            ))}
          </div>
        )}
        {contentSeoSubtance?.isSubstance && (
          <div
            style={{ order: 16 }}
            class={`pb-4 border-t border-gray-300 order-${16}`}
          >
            <h2 class="mb-0">Quer saber mais?</h2>
            <div>
              <p>
                Consulta também a Bula do {contentSeoSubtance?.nameSubstance}
              </p>
              <a
                class="text-primary underline hover:text-black text-lg"
                href={`/${contentSeoSubtance?.slug}/bula`}
              >
                Ler a bula do {contentSeoSubtance?.nameSubstance} completa
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ContenteSeoSubtance;
