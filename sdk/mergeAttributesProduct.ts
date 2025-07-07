import { ProductAttribute } from "deco-sites/consul-remedio/commerce/ContentTypes.ts";

function mergeAndSortAttributes(
  array1: ProductAttribute[],
  array2: ProductAttribute[],
): ProductAttribute[] {
  // Títulos presentes no array1
  const titlesInArray1 = new Set(
    array1.map((attr) => attr.attribute?.title).filter(Boolean),
  );

  // Filtra array2 para manter apenas atributos com título presente no array1
  const filteredArray2 = array2.filter(
    (attr) => attr.attribute?.title && titlesInArray1.has(attr.attribute.title),
  );

  // Junta os dois arrays
  const combinedArray = [...array1, ...filteredArray2];

  // Remove duplicados por título, mantendo o primeiro encontrado
  const uniqueAttributesMap = new Map();

  for (const item of combinedArray) {
    const attributeTitle = item.attribute?.title;

    if (attributeTitle) {
      if (!uniqueAttributesMap.has(attributeTitle)) {
        uniqueAttributesMap.set(attributeTitle, item);
      }
    } else {
      uniqueAttributesMap.set(`_no_title_${item.id}`, item);
    }
  }

  return Array.from(uniqueAttributesMap.values());
}

export default mergeAndSortAttributes;
