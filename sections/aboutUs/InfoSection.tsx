import { ImageWidget } from "apps/admin/widgets.ts";

export interface InfoSection {
  title: string;
  description: string;
  image: ImageWidget;
}

function InfoSection({ title, description, image }: InfoSection) {
  return (
    <section class="bg-neutral-content mt-4 mb-[1px] lg:mb-4 max-w-[1256px] mx-auto">
      <div class="flex flex-col lg:flex-row py-4 pr-0 lg:pr-4 w-full gap-5 lg:gap-0">
        <div class="flex justify-center items-center w-full lg:w-1/3">
          <img
            src={image}
            alt="A Consulta Remédios está fornecendo aos profissionais de saúde novas ferramentas para cuidar de seus clientes."
            class="max-w-[370px] max-h-[192px] px-4 lg:px-0"
            width={370}
            height={192}
            loading={"lazy"}
          />
        </div>
        <div class="w-full lg:w-2/3 px-4 lg:px-0 h-auto">
          <h3 class="font-medium text-[28px] leading-tight">{title}</h3>
          <p class="font-normal text-[18px] mt-4 leading-tight">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
export default InfoSection;
