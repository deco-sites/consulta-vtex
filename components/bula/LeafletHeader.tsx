import { Product, ProductVariation } from "../../commerce/ContentTypes.ts";
import Slider from "../../components/ui/Slider.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { OrderType } from "deco-sites/consul-remedio/components/bula/LeafletDetails.tsx";

interface LeafletHeaderProps {
  contentPage: Product | ProductVariation | null;
}

export function LeafletHeader({ contentPage }: LeafletHeaderProps) {
  const id = "leaflet-menu-carousel";

  if (!contentPage) return null;

  // Determine if contentPage is a Product or ProductVariation
  const isProductVariation = "productId" in contentPage;

  // Extract product data based on the type
  const productTitle = isProductVariation
    ? contentPage.product?.title
    : contentPage.title ?? contentPage.substance?.substanceName;

  // Extract substance (active ingredient) and its slug
  const substanceName = isProductVariation
    ? contentPage.product?.substance?.substanceName
    : contentPage.substance?.substanceName;

  const substanceSlug = isProductVariation
    ? contentPage.product?.substance?.slug
    : contentPage.substance?.slug;

  // Extract therapeutic class and its slug
  const therapeuticClassName = isProductVariation
    ? contentPage.product?.therapeuticClass?.therapeuticClassName
    : contentPage.therapeuticCLass?.therapeuticClassName;

  const therapeuticClassSlug = isProductVariation
    ? contentPage.product?.therapeuticClass?.slug?.replace("-root", "")
    : contentPage.therapeuticCLass?.slug?.replace("-root", "");

  // Access product attributes
  const productAttributes = isProductVariation
    ? contentPage.product?.productAttribute
    : contentPage.productAttribute ?? contentPage.substance.substanceAttribute;

  // Access substance for "Ação da Substância"
  const substance = isProductVariation
    ? contentPage.product?.substance
    : contentPage.substance;

  // Filter only the "Ação da Substância" attribute
  const substanceActionAttribute = substance?.substanceAttribute
    ?.filter(
      (attr) =>
        attr.attribute?.title === "Ação da Substância" ||
        attr.attributeId === 16,
    )
    .map((sa) => ({
      id: sa.id,
      attribute: sa.attribute,
      value: sa.value,
    })) || [];

  // Combine product attributes and substance action attribute
  const combinedAttributes = [
    ...(productAttributes?.map((attr) => ({
      id: attr.id,
      attribute: attr.attribute,
      value: attr.value,
    })) || []),
    ...substanceActionAttribute,
  ];

  // Filter only visible attributes and sort them
  const visibleAttributes = combinedAttributes
    .filter(
      (attr) => !attr.attribute?.hidden && attr.value && attr.attribute?.title,
    )
    .sort((a, b) => {
      return (a.attribute?.sort || 0) - (b.attribute?.sort || 0);
    });

  const isoDate = contentPage.updated ?? contentPage.substance.updated;
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("pt-BR", options);

  const disease = contentPage?.substance?.disease ?? contentPage?.disease;

  const filteredAtributes = visibleAttributes?.filter(
    (obj, index, self) =>
      index ===
        self.findIndex((t) => t.attribute?.title === obj.attribute?.title),
  );

  const leafletSubstance = contentPage?.slug ? false : true;

  const order = {
    "Para que serve": 1,
    "Contraindicação": 2,
    "Como usar": 3,
    "Precauções": 8,
    "Superdose": 5,
    "Riscos": 6,
    "Reações Adversas": 4,
    "Interação Medicamentosa": 7,
    "Interação Alimentícia": 10,
    "Ação da Substância": 9,
    "Fontes consultadas": 11,
  };

  if (leafletSubstance) {
    filteredAtributes.forEach((attr) => {
      if (order[attr.attribute.title as keyof OrderType]) {
        attr.attribute.sort = order[attr.attribute.title as keyof OrderType];
      }
    });
  }

  return (
    <>
      <div class="max-w-[1366px] w-full px-4 mx-auto lg:px-10">
        <h1 class="text-[#212529] text-lg lg:text-[32px] leading-[38px]">
          Bula do {productTitle}
        </h1>

        <div class="mt-2 text-[#212529] text-lg font-normal font-['Inter']">
          {substanceName && substanceSlug && (
            <p>
              Princípio Ativo:
              <a
                href={`/${substanceSlug}/pa`}
                rel="noopener noreferrer"
                class="text-primary underline underline-offset-[3.5px] text-lg font-normal font-['Inter'] hover:text-inherit ml-1"
              >
                {substanceName}
              </a>
            </p>
          )}
          {therapeuticClassName && therapeuticClassSlug && (
            <p>
              Classe Terapêutica:
              <a
                href={`/b/${therapeuticClassSlug?.replace("-root", "")}`}
                rel="noopener noreferrer"
                class="text-primary underline underline-offset-[3.5px] text-lg font-normal font-['Inter'] hover:text-inherit ml-1"
              >
                {therapeuticClassName}
              </a>
            </p>
          )}
        </div>
      </div>
      <div class="max-w-[1366px] w-full mx-auto px-4 lg:px-10 max-lg:py-3">
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

      <div class="sticky top-0 shadow-[0_3px_3px_0_#dee2e6] bg-white z-[3] mb-6 lg:px-14">
        {/* Carrossel de navegação */}
        <div id={id} class="max-w-full mx-auto flex flex-col relative py-3">
          <Slider class="carousel carousel-center gap-4 row-start-2 row-end-5 hide-scrollbar snap-x snap-mandatory">
            {filteredAtributes
              ?.sort(
                (a, b) => (a.attribute?.sort || 0) - (b.attribute?.sort || 0),
              )
              .map((attr, index) => {
                // Usar anchor do atributo ou gerar um ID baseado no ID do atributo
                const sectionId = attr.attribute?.anchor ||
                  `section-${attr.id}`;
                // O primeiro item começa como ativo por padrão
                const isFirstItem = index === 0;

                return (
                  <Slider.Item
                    index={index}
                    class="carousel-item snap-center shrink-0 first:pl-6 sm:first:pl-0 last:pr-6 sm:last:pr-0"
                  >
                    <a
                      key={attr.id}
                      href={`#${sectionId}`}
                      class={`px-4 py-2 whitespace-nowrap text-base ${
                        isFirstItem
                          ? "bg-primary hover:underline hover:underline-[3px] text-white py-2 px-4 rounded-md font-medium text-center"
                          : "text-primary hover:underline hover:underline-[3px]"
                      } leaflet-nav-item`}
                      data-section={sectionId}
                      data-active={isFirstItem ? "true" : "false"}
                      onClick={(e) => {
                        e.preventDefault();

                        // Scroll para a seção
                        const section = document.getElementById(sectionId);
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                          globalThis.window.scrollBy(0, -20);
                        }

                        // Atualiza a navegação visualmente
                        const navItems = document.querySelectorAll(
                          ".leaflet-nav-item",
                        );
                        navItems.forEach((item) => {
                          // Remove a classe ativa de todos os itens
                          item.setAttribute("data-active", "false");
                          item.className = item.className
                            .replace("bg-primary", "")
                            .replace("text-white", "text-primary")
                            .replace(
                              "py-2 px-4 rounded-md font-medium text-center",
                              "",
                            )
                            .trim() +
                            " text-primary hover:underline hover:underline-[3px]";
                        });

                        // Adiciona as classes ativas ao item clicado
                        e.currentTarget.setAttribute("data-active", "true");
                        e.currentTarget.className =
                          "px-4 py-2 whitespace-nowrap text-base text-base bg-primary hover:underline hover:underline-[3px] text-white py-2 px-4 rounded-md font-medium text-center leaflet-nav-item";
                      }}
                    >
                      {attr.attribute?.title}
                    </a>
                  </Slider.Item>
                );
              })}
            {disease && disease.length > 0 && (
              <Slider.Item
                index={filteredAtributes?.length}
                class="carousel-item snap-center shrink-0 first:pl-6 sm:first:pl-0 last:pr-6 sm:last:pr-0"
              >
                <a
                  href={`#doencas-relacionadas`}
                  class={`px-4 py-2 whitespace-nowrap text-base text-primary hover:underline hover:underline-[3px] leaflet-nav-item`}
                  data-section={"doencas-relacionadas"}
                  data-active={"false"}
                  onClick={(e) => {
                    e.preventDefault();

                    // Scroll para a seção
                    const section = document.getElementById(
                      "doencas-relacionadas",
                    );
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                      globalThis.window.scrollBy(0, -20);
                    }

                    // Atualiza a navegação visualmente
                    const navItems = document.querySelectorAll(
                      ".leaflet-nav-item",
                    );
                    navItems.forEach((item) => {
                      // Remove a classe ativa de todos os itens
                      item.setAttribute("data-active", "false");
                      item.className = item.className
                        .replace("bg-primary", "")
                        .replace("text-white", "text-primary")
                        .replace(
                          "py-2 px-4 rounded-md font-medium text-center",
                          "",
                        )
                        .trim() +
                        " text-primary hover:underline hover:underline-[3px]";
                    });

                    // Adiciona as classes ativas ao item clicado
                    e.currentTarget.setAttribute("data-active", "true");
                    e.currentTarget.className =
                      "px-4 py-2 whitespace-nowrap text-base text-base bg-primary hover:underline hover:underline-[3px] text-white py-2 px-4 rounded-md font-medium text-center leaflet-nav-item";
                  }}
                >
                  Doenças relacionadas
                </a>
              </Slider.Item>
            )}
          </Slider>

          {/* Botões de navegação do carrossel */}
          <div class="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Slider.PrevButton class="disabled:hidden border rounded-full w-9 h-9 bg-white flex items-center justify-center border-[#212529] hover:bg-gray-100">
              <Icon size={24} id="ChevronLeft" strokeWidth={3} class="w-5" />
            </Slider.PrevButton>
          </div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Slider.NextButton class="disabled:hidden border rounded-full w-9 h-9 bg-white flex items-center justify-center border-[#212529] hover:bg-gray-100">
              <Icon size={24} id="ChevronRight" strokeWidth={3} />
            </Slider.NextButton>
          </div>

          <Slider.JS rootId={id} />
        </div>
      </div>

      {/* Script inline para gerenciar o comportamento de scroll */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Script para atualizar o menu de navegação durante scroll
            document.addEventListener('DOMContentLoaded', function() {
              // Função para atualizar o estilo de um item de navegação
              function setActiveNavItem(item) {
                // Reset todos os itens para inativo
                const navItems = document.querySelectorAll('.leaflet-nav-item');
                navItems.forEach(navItem => {
                  navItem.setAttribute('data-active', 'false');
                  navItem.className = navItem.className
                    .replace('bg-primary', '')
                    .replace('text-white', 'text-primary')
                    .replace('py-2 px-4 rounded-md font-medium text-center', '')
                    .trim() + ' text-primary hover:underline hover:underline-[3px]';
                });
                
                // Define o item atual como ativo
                if (item) {
                  item.setAttribute('data-active', 'true');
                  item.className = 'px-4 py-2 whitespace-nowrap text-base font-medium font-[\\'Inter\\'] bg-primary hover:underline hover:underline-[3px] text-white py-2 px-4 rounded-md font-medium text-center leaflet-nav-item';
                }
              }
              
              window.addEventListener('scroll', function() {
                const sections = document.querySelectorAll('.leaflet-section');
                
                // Encontra a seção atualmente visível
                let activeSection = null;
                sections.forEach(section => {
                  const rect = section.getBoundingClientRect();
                  if (rect.top <= 150) {
                    activeSection = section.id;
                  }
                });
                
                if (activeSection) {
                  // Encontra o item de navegação correspondente
                  const activeNavItem = document.querySelector(\`.leaflet-nav-item[data-section="\${activeSection}"]\`);
                  if (activeNavItem) {
                    setActiveNavItem(activeNavItem);
                  }
                }
              });
            });
          `,
        }}
      />
    </>
  );
}

export default LeafletHeader;
