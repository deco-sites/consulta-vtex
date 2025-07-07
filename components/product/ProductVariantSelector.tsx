import { useVariantPossibilitiesVariant } from "../../sdk/useVariantPossiblities.ts";
import type { Product } from "apps/commerce/types.ts";
import { invoke } from "../../runtime.ts";
import InfoTooltip from "./InfoTooltip.tsx";

export interface Props {
  product: Product;
}

function VariantSelector({ product }: Props) {
  const possibilitiesNew = useVariantPossibilitiesVariant(product);

  async function onSubmit(id: number) {
    try {
      const response = await invoke.site.loaders.getProduct({
        id: id,
      });

      const linkProduct = response?.additionalProperty?.find(
        (property) => property.name === "Spot" && property.value,
      );

      if (linkProduct) {
        globalThis.location.pathname = linkProduct.value?.replace(
          "https://consultaremedios.com.br",
          "",
        )!;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  // Configuração dos tooltips
  const tooltipConfig: Record<string, string> = {
    "Quantidade na embalagem": "Número de unidades do produto por embalagem.",
    "Dose":
      "Quantidade de princípio ativo por unidade, como 50mg por comprimido.",
    "Forma Farmacêutica":
      "Estado físico do medicamento, como comprimido, cápsula ou solução.",
  };

  return (
    <ul class="flex flex-col gap-4">
      {Object.keys(possibilitiesNew).map((name) => (
        <li class="flex flex-col gap-2">
          <span class="text-base font-bold">
            {name}
            {tooltipConfig[name] && <InfoTooltip text={tooltipConfig[name]} />}
          </span>
          <ul class="flex flex-row gap-3 flex-wrap">
            {Object.entries(possibilitiesNew[name]).map(([name, value]) => {
              const { id, selected, available } = value;

              return (
                <li>
                  <button
                    class={`border text-sm px-2 py-1 rounded hover:bg-gray-100 ${
                      selected == "true"
                        ? "border-primary border-[2px]"
                        : available
                        ? "border-secondary"
                        : "border-secondary"
                    }`}
                    onClick={() => onSubmit(id)}
                  >
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
