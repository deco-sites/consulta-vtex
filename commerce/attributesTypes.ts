export interface AttributeSubstance {
  substanceAttribute: Array<{
    id: number;
    substanceId: number;
    attributeId: number;
    attribute: SubstanceSeo;
    attributeValueId: number | null;
    value: string;
  }>;
  nameSubstance: string;
  isSubstance: boolean;
  medicalSpecialty?: Array<{
    medicalSpecialtyName: string;
  }>;
  disease?: Array<{
    diseaseName: string;
    slug: string;
  }>;
  slug?: string;
  dcb?: string;
  genericProducts?:
    | Array<{
      href: string;
      name: string;
    }>
    | null;
}
export interface SubstanceSeo {
  id: number;
  attributeFieldType: string | null;
  status: number;
  productId: number | null;
  product: unknown | null;
  variationId: number | null;
  variation: unknown | null;
  substanceId: number | null;
  substance: unknown | null;
  title: string;
  customerTitle: string;
  subtitle: string | null;
  required: boolean;
  hidden: boolean;
  comparison: boolean;
  leaflet: boolean;
  isFilter: boolean;
  index: boolean;
  variationSelector: boolean;
  legacyId: number | null;
  anchor: string;
  sort: number;
  attributeValue: unknown | null;
  attributeCategory: unknown | null;
  value: string;
}

export interface CategoryThumb {
  id: number;
  statusId: number;
  categoryId: number;
  categoryName: string;
  path: string;
  categorySeo: string;
  slug: string;
  description: string;
  titleH1: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  image: string;
}
