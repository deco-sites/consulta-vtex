import BreadcrumbOptimized from "../../components/ui/BreadcrumbOptimized.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface Link {
  label?: string;
  href?: string;
}

export interface InfoAndBreadcrumbProps {
  items?: Link[];
  infos?: Infos;
}

export interface Infos {
  nome: string;
  crf: string;
  experiencia: string;
  educacao: string;
  hrefLinkedin?: string;
  hrefX?: string;
  foto: ImageWidget;
}

function InfoAndBreadCrumb(props: InfoAndBreadcrumbProps) {
  const { items, infos } = props;

  const nome = infos?.nome;
  const crf = infos?.crf;
  const experiencia = infos?.experiencia;
  const educacao = infos?.educacao;
  const hrefLinkedin = infos?.hrefLinkedin;
  const hrefX = infos?.hrefX;
  const foto = infos?.foto;

  if (!items || items.length === 0) return null;

  return (
    <div class="flex flex-col bg-[#E7F1FF]">
      <div class="mx-auto max-w-7xl w-full">
        <BreadcrumbOptimized breadcrumbs={items} />
        <div class="bg-white rounded-lg shadow-xl mx-4 mt-4 mb-6 p-4">
          <div class="flex items-center mb-8 flex-col lg:flex-row">
            <div class="my-4">
              <a href="">
                <img
                  class="w-24 h-24 rounded-full"
                  src={foto}
                  alt="foto do farmaceutico"
                />
              </a>
            </div>
            <div class="p-4">
              <h1 class="text-3xl font-medium text-gray-800 mb-2">{nome}</h1>
              <p class="text-gray-600 font-normal">{crf}</p>
            </div>
          </div>

          <div class="flex items-start p-4 flex-col lg:items-center lg:flex-row">
            <div class="p-4">
              <h2 class="text-xl font-medium text-gray-800">Experiência</h2>
              <p class="text-gray-600 mb-4 font-normal">{experiencia}</p>
            </div>
            <div class="p-4">
              <h2 class="text-xl font-medium text-gray-800">Educação</h2>
              <p class="text-gray-600 mb-4 font-normal">{educacao}</p>
            </div>
            <div class="flex gap-4 px-3 mb-4">
              <a
                target={"_blank"}
                href={hrefLinkedin ||
                  "https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit"}
                class="hover:opacity-80"
              >
                <img
                  src="https://assets.decocache.com/consul-remedio/68d04f09-3640-46ab-93af-193de9bae4d8/button.png"
                  alt="Twitter"
                  width="50"
                  height="50"
                />
              </a>
              <a
                target={"_blank"}
                href={hrefX || "https://twitter.com/c_remedios"}
                class="hover:opacity-80"
              >
                <img
                  src="https://assets.decocache.com/consul-remedio/6897b902-8413-4d50-b1a8-7fc7158fc0ad/button-(1).png"
                  alt="LinkedIn"
                  width="50"
                  height="50"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoAndBreadCrumb;
