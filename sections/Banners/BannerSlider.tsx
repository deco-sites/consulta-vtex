import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Header from "../../components/ui/SectionHeader.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Icon from "../../components/ui/Icon.tsx";

export interface Category {
  label: string;
  href?: string;
  image: ImageWidget;
}

export interface Props {
  header?: {
    title?: string;
    description?: string;
  };
  items?: Category[];
  layout?: {
    headerAlignment?: "center" | "left";
  };
}

const DEFAULT_LIST = [
  {
    label: "Feminino",
    href: "/feminino",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2753/b2278d2d-2270-482b-98d4-f09d5f05ba97",
  },
  {
    label: "Feminino",
    href: "/feminino",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2753/b2278d2d-2270-482b-98d4-f09d5f05ba97",
  },
  {
    label: "Feminino",
    href: "/feminino",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2753/b2278d2d-2270-482b-98d4-f09d5f05ba97",
  },
  {
    label: "Feminino",
    href: "/feminino",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2753/b2278d2d-2270-482b-98d4-f09d5f05ba97",
  },
  {
    label: "Feminino",
    href: "/feminino",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2753/b2278d2d-2270-482b-98d4-f09d5f05ba97",
  },
];

function CategoryList(props: Props) {
  const id = useId();
  const {
    header = {
      title: "Categorias",
      description: "",
    },
    items = DEFAULT_LIST,
    layout = {
      headerAlignment: "left",
    },
  } = props;

  return (
    <div class="max-w-[1366px] py-8 flex flex-col gap-8 lg:gap-10 text-info lg:py-10 px-4 lg:px-10 mx-auto ">
      <Header
        title={header.title}
        description={header.description || ""}
        alignment={layout.headerAlignment || "left"}
        fontSize="Small"
      />
      <div id={id} class="max-w-full mx-auto flex flex-col relative">
        <Slider class="carousel carousel-start gap-4 lg:gap-8 row-start-2 row-end-5 ">
          {items?.map(({ label, href, image }, index) => (
            <Slider.Item
              index={index}
              class="flex flex-col gap-4 carousel-item first:pl-6 sm:first:pl-0 last:pr-6 sm:last:pr-0"
            >
              <a
                href={href}
                class="flex flex-col items-center justify-center gap-2 w-[120px]"
              >
                <div class="">
                  <Image
                    src={image}
                    alt={label}
                    width={72}
                    height={72}
                    loading="eager"
                  />
                </div>
                <span class="font-medium text-sm text-center">{label}</span>
              </a>
            </Slider.Item>
          ))}
        </Slider>
        <div class="absolute left-0 top-1/2 -translate-y-1/2">
          <Slider.PrevButton class="disabled:hidden border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
            <Icon size={24} id="ChevronLeft" strokeWidth={3} class="w-5" />
          </Slider.PrevButton>
        </div>
        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <Slider.NextButton class="disabled:hidden border rounded-full w-9 h-9 bg-white flex items-center justify-center border-info hover:bg-gray-100">
            <Icon size={24} id="ChevronRight" strokeWidth={3} />
          </Slider.NextButton>
        </div>
        <Slider.JS rootId={id} />
      </div>
    </div>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default CategoryList;
