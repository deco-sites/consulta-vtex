import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
import { clx } from "../../sdk/clx.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
// import Breadcrumb from "deco-sites/consul-remedio/components/ui/Breadcrumb.tsx";

// Definição das tipagens para o admin
export interface Subcategory {
  label: string;
  href: string;
}

export interface Category {
  label: string;
  icon: ImageWidget | string;
  subcategories?: Subcategory[];
  href: string;
}

export interface Layout {
  columns?: "1" | "2" | "3" | "4";
  hide?: {
    title?: boolean;
    icons?: boolean;
    subcategories?: boolean;
  };
}

export interface Props {
  title?: string;
  categories?: Category[];
  layout?: Layout;
}

export interface Props {
  title?: string;
  categories?: Category[];
  layout?: Layout;
}

const categoriesData = [
  {
    label: "Acessórios para a Saúde",
    href: "acessorios-para-a-saude/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/18D67158B89CD80E58B46DEF2AD24FD4.svg",
    subcategories: [
      {
        label: "Porta-comprimidos",
        href: "acessorios-para-a-saude/porta-comprimidos/c",
      },
    ],
  },
  {
    label: "Alimentos e Bebidas",
    href: "alimentos-e-bebidas/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/7C5FB94CBBADC1606E705A90CA6616CB.svg",
    subcategories: [
      {
        label: "Balas",
        href: "alimentos-e-bebidas/balas/c",
      },
      {
        label: "Chicletes",
        href: "alimentos-e-bebidas/chicletes/c",
      },
      {
        label: "Chocolate",
        href: "alimentos-e-bebidas/chocolate/c",
      },
      {
        label: "Complemento Alimentar",
        href: "alimentos-e-bebidas/complemento-alimentar/c",
      },
      {
        label: "Energéticos",
        href: "alimentos-e-bebidas/energeticos/c",
      },
      {
        label: "Extrato de própolis",
        href: "alimentos-e-bebidas/extrato-de-propolis/c",
      },
    ],
  },
  {
    label: "Anestésicos tópicos",
    href: "anestesicos-topicos/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/77CB74CCC366BD9976DA454823054BF7.svg",
  },
  {
    label: "Antialérgicos",
    href: "antialergicos/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/60E1FE7F0E476D89428F2AD9A4252CD0.svg",
  },
  {
    label: "Antifúngico",
    href: "antifungico/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/12C0F9334C0D054B5274CC6147EF1761.svg",
    subcategories: [
      {
        label: "Aspergilose",
        href: "antifungico/aspergilose/c",
      },
      {
        label: "Candidíase",
        href: "antifungico/candidiase/c",
      },
      {
        label: "Micose",
        href: "antifungico/micose/c",
      },
    ],
  },
  {
    label: "Antiparasitários",
    href: "antiparasitarios/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/AE6425A16774F58EF3AD2CB4EEC72E5D.svg",
  },
  {
    label: "Aparelho Digestivo",
    href: "aparelho-digestivo/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/CFCF0B6C1E2BBF21A4D598247C897317.svg",
    subcategories: [
      {
        label: "Antiácidos",
        href: "aparelho-digestivo/antiacidos/c",
      },
      {
        label: "Antigases",
        href: "aparelho-digestivo/antigases/c",
      },
      {
        label: "Azia",
        href: "aparelho-digestivo/azia/c",
      },
      {
        label: "Cirrose",
        href: "aparelho-digestivo/cirrose/c",
      },
      {
        label: "Diarreia",
        href: "aparelho-digestivo/diarreia/c",
      },
    ],
  },
  {
    label: "Aparelho Respiratório",
    href: "aparelho-respiratorio/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/9E8B57D5266612944E4D6D23589050F1.svg",
    subcategories: [
      {
        label: "Amigdalite",
        href: "aparelho-respiratorio/amigdalite/c",
      },
      {
        label: "Asma",
        href: "aparelho-respiratorio/asma/c",
      },
      {
        label: "Bronquite",
        href: "aparelho-respiratorio/bronquite/c",
      },
    ],
  },
  {
    label: "Câncer",
    href: "cancer/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/5104F76D37A723F0D9F1D1C841207D77.svg",
    subcategories: [
      {
        label: "Câncer Basocelular",
        href: "cancer/basocelular/c",
      },
      {
        label: "Câncer Colorretal",
        href: "cancer/colorretal/c",
      },
      {
        label: "Câncer de Bexiga",
        href: "cancer/bexiga/c",
      },
    ],
  },
  {
    label: "Casa",
    href: "casa/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/97B28CAD10D96DEE64D126B10806378D.svg",
    subcategories: [
      {
        label: "Aromaterapia",
        href: "casa/aromaterapia/c",
      },
      {
        label: "Bloqueador de Odores Sanitários",
        href: "casa/bloqueador-de-odores-sanitarios/c",
      },
      {
        label: "Eletrônicos",
        href: "casa/eletronicos/c",
      },
    ],
  },
  {
    label: "Colágenos",
    href: "colagenos/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/518450B4140D2F12A081C0F4CC54C678.svg",
    subcategories: [
      {
        label: "Colágeno Hidrolisado",
        href: "colagenos/colageno-hidrolisado/c",
      },
      {
        label: "Colágeno Não Hidrolisado",
        href: "colagenos/colageno-nao-hidrolisado/c",
      },
      {
        label: "Peptídeos de Colágeno",
        href: "colagenos/peptideos-de-colageno/c",
      },
    ],
  },
  {
    label: "Corpo e Banho",
    href: "corpo-e-banho/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/66A570F1795921125763F3A99E02A521.svg",
    subcategories: [
      {
        label: "Descolorante de Pelos",
        href: "corpo-e-banho/descolorante-de-pelos/c",
      },
      {
        label: "Esponjas e Luvas",
        href: "corpo-e-banho/esponjas-e-luvas/c",
      },
    ],
  },
  {
    label: "Cruelty-Free",
    href: "cruelty-free/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/A744DA6657E0B40BB75AF628831A9E02.svg",
  },
  {
    label: "Cuidados Pessoais",
    href: "cuidados-pessoais/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/712A44BB505CEE67441113AF04045754.svg",
    subcategories: [
      {
        label: "Aparador de Pelos",
        href: "cuidados-pessoais/aparador-de-pelos/c",
      },
      {
        label: "Cabelos",
        href: "cuidados-pessoais/cabelos/c",
      },
      {
        label: "Colônias",
        href: "cuidados-pessoais/colonias/c",
      },
    ],
  },
  {
    label: "Dermocosméticos",
    href: "dermocosmeticos/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/E4EEBF606926A0ED18A2041543FC883C.svg",
  },
  {
    label: "Vacinas",
    href: "vacinas/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/5D5F578107E01FB56837D1A2EEAB87A0.svg",
    subcategories: [
      {
        label: "Vacina Antitetânica",
        href: "vacinas/vacina-antitetanica/c",
      },
      {
        label: "Vacina Catapora",
        href: "vacinas/vacina-catapora/c",
      },
      {
        label: "Vacina DTP",
        href: "vacinas/vacina-dtp/c",
      },
    ],
  },
  {
    label: "Vitaminas e Minerais",
    href: "vitaminas-e-minerais/c",
    icon:
      "https://cr-net-public-prod.s3.amazonaws.com/category_image/E95E2241F2990A2AFE5098BE0E105A93.svg",
    subcategories: [
      {
        label: "Antioxidante",
        href: "vitaminas-e-minerais/antioxidante/c",
      },
      {
        label: "Cansaço",
        href: "vitaminas-e-minerais/cansaco/c",
      },
      {
        label: "Vitamina C",
        href: "vitaminas-e-minerais/vitamina-c/c",
      },
    ],
  },
];

const COLUMNS = {
  "1": "columns-1",
  "2": "columns-1 md:columns-2",
  "3": "columns-1 md:columns-2 lg:columns-3",
  "4": "columns-1 md:columns-2 lg:columns-4",
};

function CategoryPageList({
  title = "Todas as Categorias do CR",
  categories = categoriesData,
  layout = {
    columns: "3", // Definindo 4 colunas como padrão
    hide: {
      title: false,
      icons: false,
      subcategories: false,
    },
  },
}: Props) {
  const breadcrumb = [
    { label: "home", href: "/" },
    { label: "Categorias", href: "/categorias" },
  ];
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1336px] lg:px-10">
        <div class="pb-5">
          <BreadcrumbOptimized breadcrumbs={breadcrumb} />
        </div>

        {!layout?.hide?.title && (
          <h1 className="text-[2rem] font-medium leading-tight -tracking-wider mb-2 text-black">
            {title}
          </h1>
        )}

        {/* Layout de galeria com column-count */}
        <div className={clx(COLUMNS[layout?.columns ?? "3"], "gap-6 pt-4")}>
          {categories.map((category, index) => (
            <div
              key={index}
              className="px-6 py-2 rounded-[4px] break-inside-avoid inline-block w-full mb-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.20)]"
            >
              <div className="flex items-center justify-between mb-3">
                <a href={category.href} className="block">
                  <h2
                    className="text-[1.75rem] font-medium leading-tight -tracking-tight text-black hover:underline hover:underline-offset-[3px] break-words"
                    style={{ wordBreak: "break-word" }}
                  >
                    {category.label}
                  </h2>
                </a>
                {!layout?.hide?.icons && (
                  <img
                    src={category.icon}
                    alt={`Ícone ${category.label}`}
                    className="w-16 h-w-16 ml-3"
                    width={64}
                    height={64}
                  />
                )}
              </div>

              {!layout?.hide?.subcategories &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                <div className="mt-2">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <a
                      key={subIndex}
                      href={subcategory.href}
                      className="block py-3 text-[#099] hover:underline hover:underline-offset-[3px] text-base font-normal"
                    >
                      {subcategory.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadingFallback() {
  return (
    <div
      style={{ height: "1000px" }}
      class="flex justify-center flex-row px-4 lg:px-10 gap-4 py-8 lg:py-10 mx-auto max-w-[1366px]"
    >
      <div class="w-full  max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
      <div class="w-full  max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
      <div class="w-full  max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}

export default CategoryPageList;
