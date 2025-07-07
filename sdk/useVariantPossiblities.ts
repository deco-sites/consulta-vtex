import type { ProductLeaf, PropertyValue } from "../commerce/types.ts";
import { parseSlug } from "../utils/transform.ts";

export type Possibilities = Record<string, Record<string, string | undefined>>;
export type PossibilitiesVarint = Record<
  string,
  Record<string, { id: number; selected: string; available: boolean }>
>;

const hash = ({ name, value }: PropertyValue) => `${name}::${value}`;

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

export const useVariantPossibilities = (
  variants: ProductLeaf[],
  selected: ProductLeaf,
): Possibilities => {
  const possibilities: Possibilities = {};
  const selectedSpecs = new Set(selected.additionalProperty?.map(hash));

  for (const variant of variants) {
    const { url, additionalProperty = [], productID } = variant;
    const isSelected = productID === selected.productID;
    const specs = additionalProperty.filter(({ name }) => !omit.has(name!));

    for (let it = 0; it < specs.length; it++) {
      const name = specs[it].name!;
      const value = specs[it].value!;

      if (omit.has(name)) continue;

      if (!possibilities[name]) {
        possibilities[name] = {};
      }

      // First row is always selectable
      const isSelectable = it === 0 ||
        specs.every((s) => s.name === name || selectedSpecs.has(hash(s)));

      possibilities[name][value] = isSelected
        ? url
        : isSelectable
        ? possibilities[name][value] || url
        : possibilities[name][value];
    }
  }

  return possibilities;
};

export const useVariantPossibilitiesVariant = (
  selected: ProductLeaf,
): PossibilitiesVarint => {
  const possibilities: PossibilitiesVarint = {};

  const { variantsProperty = [] } = selected;

  const specs = variantsProperty.filter(
    ({ name }) =>
      !omit.has(name!) &&
      name !== "Spot" &&
      name !== "Principio Ativo" &&
      name !== "Forma Farmacêutica" &&
      name !== "Companhia",
  );

  for (let it = 0; it < specs.length; it++) {
    const name = specs[it].selectionName!;
    const value = specs[it].name!;
    const url = specs[it].url!;
    const selected = specs[it].value!;
    const available = specs[it].available!;
    const { id } = parseSlug(url);

    if (omit.has(name)) continue;

    if (!possibilities[name]) {
      possibilities[name] = {};
    }

    possibilities[name][value] = {
      id: Number(id),
      selected: selected,
      available: available,
    };
  }

  return possibilities;
};
