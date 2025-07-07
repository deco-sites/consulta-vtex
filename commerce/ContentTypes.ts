// Arquivo: commerce/ContentTypes.ts

// Interfaces base

// Estado/Status
export interface Status {
  id: number;
  statusId?: number | null;
  status?: number | null;
}

// Unidade
export interface Unit {
  id: number;
  unitName: string;
  legacyId?: number | null;
}

// Cidade
export interface City {
  id?: number | null;
  cityName?: string | null;
}

// Estado
export interface State {
  id?: number | null;
  stateCode?: string | null;
  stateName?: string | null;
}

// Forma farmacêutica
export interface PharmaceuticForm {
  id: number;
  statusId?: number | null;
  legacyId?: number | null;
  pharmaceuticFormName: string;
  image?: string | null;
  created?: string | null;
  updated?: string | null;
}

// Método de administração
export interface AdministrationMethod {
  id: number;
  administrationMethodName: string;
  legacyId?: number | null;
}

// Tipo de prescrição
export interface PrescriptionType {
  id: number;
  statusId?: number | null;
  prescriptionTypeName: string;
  required: boolean;
  retention: boolean;
  stripeId?: string | null;
  validity?: number | null;
  intervalId?: number | null;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
}

// Classificação
export interface Classification {
  id: number;
  statusId?: number | null;
  classificationName: string;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
}

// Classe terapêutica
export interface TherapeuticClass {
  id: number;
  statusId?: number | null;
  therapeuticClassName: string;
  customerTitle?: string | null;
  slug: string;
  description?: string | null;
  code?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  titleH1?: string | null;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
}

// Parte do corpo
export interface BodyPart {
  id?: number | null;
  bodyPartName?: string | null;
  slug?: string | null;
}

// Fabricante
export interface Factory {
  id: number;
  status: number;
  factoryName: string;
  slug: string;
  commercialName?: string | null;
  cnpj?: string | null;
  address?: string | null;
  zipCode?: string | null;
  number?: string | null;
  stateId?: number | null;
  state?: State | null;
  cityId?: number | null;
  city?: City | null;
  neighboorhood?: string | null;
  thumbnail?: string | null;
  phone?: string | null;
  csPhone?: string | null;
  site?: string | null;
  email?: string | null;
  productDescription?: string | null;
  description?: string | null;
  additionalAddress?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  titleH1?: string | null;
  activeProductCount?: number | null;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
  brand?: Brand[] | null;
}

// Marca
export interface Brand {
  id: number | null;
  status: number | null;
  brandName: string | null;
  slug: string | null;
  thumbnail?: string | null;
  productDescription?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  titleH1?: string | null;
  updated?: string | null;
  created?: string | null;
  legacyId?: number | null;
  factory?: Factory | null;
}

// Doença
export interface Disease {
  id: number;
  status?: number;
  diseaseName: string;
  description?: string | null;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  titleH1?: string | null;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
  symptom?: DiseaseSyptom[] | null;
  substanceIds?: number[] | null;
}

// Interface para sintomas de doenças
export interface DiseaseSyptom {
  id: number;
  name: string;
  description?: string | null;
}

// Atributo
export interface Attribute {
  id: number;
  attributeFieldType?: string | null;
  status?: number | null;
  productId?: number | null;
  product?: ProductLimited | null;
  variationId?: number | null;
  variation?: ProductVariationLimited | null;
  substanceId?: number | null;
  substance?: SubstanceLimited | null;
  title: string;
  customerTitle: string;
  subtitle?: string | null;
  required: boolean;
  hidden: boolean;
  comparison: boolean;
  leaflet: boolean;
  isFilter: boolean;
  index: boolean;
  variationSelector: boolean;
  legacyId?: number | null;
  anchor?: string | null;
  sort?: number | null;
  attributeValue?: AttributeValue[] | null;
  attributeCategory?: AttributeCategory[] | null;
}

// Valor de atributo
export interface AttributeValue {
  id: number;
  attributeId: number;
  value: string;
}

// Categoria de atributo
export interface AttributeCategory {
  id: number;
  attributeId: number;
  categoryId: number;
}

// Atributo do produto
export interface ProductAttribute {
  id: number;
  productId?: number | null;
  attributeId?: number | null;
  attribute: Attribute;
  attributeValueId?: number | null;
  attributeValue?: AttributeValue | null;
  value: string;
}

// SubstanceAttribute - Atributo da substância
export interface SubstanceAttribute {
  id: number;
  substanceId: number;
  attributeId: number;
  attribute: Attribute;
  attributeValueId?: number | null;
  value: string;
}

// Substância
export interface Substance {
  id: number;
  statusId?: number | null;
  prescriptionTypeId?: number | null;
  prescriptionType?: PrescriptionType | null;
  bodyPartId?: number | null;
  bodyPart?: BodyPart | null;
  substanceName: string;
  substancePro?: string | null;
  dcb?: string | null;
  dci?: string | null;
  continuousUse: boolean;
  description: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  titleH1?: string | null;
  metaTitleBula?: string | null;
  metaDescriptionBula?: string | null;
  updated?: string | null;
  created?: string | null;
  legacyId?: number | null;
  category?: Category[] | null;
  medicalSpecialty?: MedicalSpecialty[] | null;
  substanceAttribute?: SubstanceAttribute[] | null;
  disease?: Disease[] | null;
}

// Versão limitada da Substance para evitar referências circulares
export interface SubstanceLimited {
  id: number;
  substanceName: string;
  slug?: string;
}

// Versão limitada do Product para evitar referências circulares
export interface ProductLimited {
  id: number;
  title: string;
}

// Versão limitada da ProductVariation para evitar referências circulares
export interface ProductVariationLimited {
  id: number;
  title: string;
}

// Categoria
export interface Category {
  id: number;
  statusId?: number | null;
  categoryId?: number | null;
  categoryName: string;
  path: string;
  categorySeo?: string | null;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  titleH1?: string | null;
  image?: string | null;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
  categoryTree?: CategoryTree[] | null;
  hideFront?: boolean | null;
  quantityProduct?: number | null;
  level?: number | null;
  subcategoryCount?: number | null;
  subcategoryCountFirstLevel?: number | null;
  last?: boolean | null;
  referenceId?: number | null;
}

// Árvore de categorias
export interface CategoryTree {
  id: number;
  parentId: number;
  categoryId: number;
}

// Categoria do produto
export interface ProductCategory {
  productId: number;
  categoryId: number;
  category: Category;
  mainCategory: boolean;
}

// Substância no item da embalagem
export interface PackageItemSubstance {
  id: number;
  packageItemId?: number | null;
  substanceId?: number | null;
  substance?: Substance | null;
  customSubstance: string;
  quantity: number;
  unitId?: number | null;
  unit: Unit;
}

// Produto kit
export interface KitProduct {
  id: number;
  status: number;
  kitProductName: string;
  created?: string | null;
  updated?: string | null;
  legacyId?: number | null;
}

// Item da embalagem
export interface PackageItem {
  id: number;
  variationId?: number | null;
  unitId?: number | null;
  unit: Unit;
  pharmaceuticFormId?: number | null;
  pharmaceuticForm: PharmaceuticForm;
  administrationMethodId?: number | null;
  administrationMethod: AdministrationMethod;
  kitProductId?: number | null;
  kitProduct?: KitProduct | null;
  unitPriceCalc: boolean;
  unitQuantity: number;
  volume?: number | null;
  legacyId?: number | null;
  packageItemSubstance: PackageItemSubstance[];
}

// Especialidade médica
export interface MedicalSpecialty {
  id: number;
  statusId?: number | null;
  medicalSpecialtyName: string;
  description?: string | null;
  legacyId?: number | null;
}

// Imagem da variação
export interface VariationImage {
  id: number;
  status: number;
  variationId?: number | null;
  image: string;
  main: boolean;
  alt?: string | null;
}

// Preço máximo ao consumidor
export interface CustomerMaximumPrice {
  id: number;
  variationId?: number | null;
  priceTaxId: number;
  priceTax?: PriceTax | null;
  price: number;
}

// Taxa de preço
export interface PriceTax {
  id: number;
  name: string;
  description?: string | null;
}

// Preço de fábrica
export interface FactoryPrice {
  id: number;
  variationId?: number | null;
  priceTaxId: number;
  priceTax?: PriceTax | null;
  price: number;
}

// Uso adulto/infantil
export interface AdultChildUse {
  id: number;
  adultChildUseName: string;
}

// Tipo de lista
export interface ListType {
  id: number;
  listTypeName: string;
}

// Controle
export interface Control {
  id: number;
  controlName: string;
}

// Temperatura de armazenamento
export interface StorageTemperature {
  id: number;
  ids?: number[] | null;
  storageTemperatureName: string;
}

// Farmácia popular
export interface PopularPharmacy {
  id?: number | null;
  popularPharmacyName?: string | null;
}

// Tarja
export interface Stripe {
  id: number;
  stripeName: string;
}

// Atributo de variação
export interface VariationAttribute {
  id: number;
  variationId: number;
  attributeId: number;
  attribute: Attribute;
  attributeValueId?: number | null;
  attributeValue?: AttributeValue | null;
  value: string;
}

// Produto
export interface Product {
  id: number;
  status: number;
  productType?: number | null;
  factoryId: number;
  factory: Factory;
  brandId: number | null;
  brand: Brand;
  bodyPartId?: number | null;
  bodyPart?: BodyPart | null;
  classificationId?: number | null;
  classification?: Classification | null;
  therapeuticClassId: number;
  therapeuticClass: TherapeuticClass;
  therapeuticCLass: TherapeuticClass;
  prescriptionTypeId: number;
  prescriptionType: PrescriptionType;
  substanceId: number;
  substance: Substance;
  title: string;
  titlePro?: string | null;
  slug: string;
  thumbnail?: string | null;
  thumbnailAlt?: string | null;
  leaflet?: string | null;
  leafletPro?: string | null;
  leafletUpdated?: string | null;
  description?: string | null;
  highlight?: string | null;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string | null;
  metaTitleLeaflet?: string | null;
  metaDescriptionLeaflet?: string | null;
  created: string;
  updated: string;
  legacyId?: number | null;
  mainCategoryId?: number | null;
  bodyPart2?: BodyPart[] | null;
  productCategory: ProductCategory[];
  productAttribute: ProductAttribute[];
  variation?: ProductVariation[] | null;
  allergicComposition: AllergicComposition[];
  disease: Disease[];
  medicalSpecialty: MedicalSpecialty[];
  variationSelectorList?: VariationSelector[] | null;
  anvisaImporterMessage?: string | null;
  hasGeneric: boolean;
  weightKg: number | null;
}

// Composição alérgica
export interface AllergicComposition {
  id: number;
  name: string;
  description?: string | null;
}

// Seletor de variação
export interface VariationSelector {
  id: number;
  name: string;
  options: VariationSelectorOption[];
}

// Opção de seletor de variação
export interface VariationSelectorOption {
  id: number;
  name: string;
  value: string;
}

// Variação do produto - Interface principal
export interface ProductVariation {
  userState?: string;
  userCep?: string;
  userStatePMC?: number;
  userStatePF?: number;
  _tempId?: string;
  id: number;
  productId: number;
  product: Product;
  status: number;
  parentVariationId?: number | null;
  parentVariation?: ProductVariation | null;
  substanceId: number;
  substance: Substance;
  prescriptionTypeId: number;
  prescriptionType: PrescriptionType;
  classificationId: number;
  classification: Classification;
  therapeuticClassId: number;
  therapeuticClass: TherapeuticClass;
  adultChildUseId?: number | null;
  adultChildUse?: AdultChildUse | null;
  listTypeId?: number | null;
  listType?: ListType | null;
  controlId?: number | null;
  control?: Control | null;
  storageTemperatureId?: number | null;
  storageTemperature?: StorageTemperature | null;
  popularPharmacyId?: number | null;
  popularPharmacy?: PopularPharmacy | null;
  stripeId?: number | null;
  stripe?: Stripe | null;
  title: string;
  titlePro?: string | null;
  bodyPartId?: number | null;
  slug: string;
  anvisaReference: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string | null;
  restrictSale: boolean;
  ncm?: string;
  ean: string;
  registry: string;
  governmentMaxPrice?: number | null;
  ggrem?: string;
  ipi: number;
  origin?: string;
  tiss?: string;
  tuss?: string;
  cap: boolean;
  confaz: boolean;
  recursionalAnalysis: boolean;
  market2016: boolean;
  discontinued: boolean;
  fractioned: boolean;
  canBeSplitted: boolean;
  weightKg?: number | null;
  hightCm?: number | null;
  widthCm?: number | null;
  lengthCm?: number | null;
  continuousUse: boolean;
  created: string;
  updated: string;
  legacyId?: number | null;
  compositionKey?: string;
  mainCategoryId?: number;
  offerCount?: number;
  minPrice: number;
  maxPrice: number;
  secondaryEan?: string[];
  bodyPart?: BodyPart | null;
  packageItem: PackageItem[];
  variationAttribute: VariationAttribute[];
  disease?: Disease[] | null;
  allergicComposition?: AllergicComposition[] | null;
  medicalSpecialty: MedicalSpecialty[];
  customerMaximumPrice: CustomerMaximumPrice[];
  factoryPrice: FactoryPrice[];
  variationImage: VariationImage[];
  currentFactoryPrice?: FactoryPrice | null;
  currentCustomerMaximumPrice?: CustomerMaximumPrice | null;
  dose: string;
  pharmaceuticForm: string;
  packageQuantity: string;
  administrationMethod: string;
  wakeProductVariantId: string | null;
  wakeProductId: string | null;
  brand: {
    brandName: string | null;
  };
}

export interface GenericProducts {
  mainVariant: boolean;
  productName: string;
  productId: string;
  alias: string;
  id: string;
  productVariantId: string;
  parentId: string | null;
  sku: string;
  variantName: string | null;
  spotInformation: string | null;
  available: boolean;
}

// Tipos especiais para uso nos componentes

// Especificação para o componente ProductSpecifications
export interface Specification {
  label: string;
  value: string;
  link?: string | null;
  tooltip?: string | null;
  isExternal?: boolean;
  complexLinks?: ComplexLink[] | null;
  doencasLinks?: DoencaLink[] | null;
}

// Link complexo para doenças
export interface ComplexLink {
  nome: string;
  slug: string | null;
}

// Link para doença
export interface DoencaLink {
  nome: string;
  slug: string | null;
}

// Request params
export interface ProductRequestParams {
  slug?: string;
  product: string;
}

// Dados simplificados para componentes simples
export interface ProductVariationDetails {
  id: number;
  title: string;
  slug: string;
  ean: string;
  dose: string;
  price: number;
  image?: string;
  imageAlt?: string;
  pharmaceuticForm: string;
  packageQuantity: string;
  administrationMethod: string;
  productName: string;
  factoryName: string;
  brandName?: string | null;
  substanceName: string;
  therapeuticClassName: string;
  ncm?: string;
  created?: string;
  updated?: string;
}

// Função para transformar a resposta da API em dados simplificados
export function transformApiResponse(
  data: ProductVariation,
): ProductVariationDetails {
  // Encontrar a imagem principal ou a primeira disponível
  const mainImage = data.variationImage?.find((img) => img.main) ||
    (data.variationImage?.length > 0 ? data.variationImage[0] : undefined);

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    ean: data.ean || "",
    dose: data.dose || "",
    price: data.minPrice || 0,
    image: mainImage?.image,
    imageAlt: mainImage?.alt || data.title,
    pharmaceuticForm: data.pharmaceuticForm || "",
    packageQuantity: data.packageQuantity || "",
    administrationMethod: data.administrationMethod || "",
    productName: data.product?.title || "",
    factoryName: data.product?.factory?.factoryName || "",
    brandName: data.product?.brand?.brandName || null,
    substanceName: data.product?.substance?.substanceName || "",
    therapeuticClassName:
      data.product?.therapeuticClass?.therapeuticClassName || "",
    ncm: data.ncm,
    created: data.created,
    updated: data.updated,
  };
}
