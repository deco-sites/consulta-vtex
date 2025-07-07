import { ImageWidget } from "apps/admin/widgets.ts";

export interface InfoDescription {
  text: string;
}

export interface InfoSection {
  title: string;
  subtitle: string;
  description: string;
  image: ImageWidget;
  information: InfoDescription[];
}

export interface Info {
  items: InfoSection[];
}

function Info({ items }: Info) {
  return (
    <div class="flex flex-col gap-4">
      {items.map((item, index) => (
        <section
          key={index}
          class="bg-[#F8F9FA] mt-4 mb-[1px] lg:mb-4 max-w-[1256px] mx-auto"
        >
          <div class="flex flex-col lg:flex-row py-4 pr-0 lg:pr-4 w-full gap-5 lg:gap-0">
            <div class="flex justify-center items-center w-full lg:w-1/3">
              <img
                src={item.image}
                alt={`${item.title} image`}
                class="max-w-[370px] max-h-[192px] px-4 lg:px-0"
                width={370}
                height={192}
                loading={"lazy"}
              />
            </div>
            <div class="w-full lg:w-2/3 px-4 lg:px-0 h-auto">
              <h2 class="font-medium text-[28px] leading-tight">
                {item.title}
              </h2>
              <h3 class="font-medium text-2xl  mt-4 leading-tight">
                {item.subtitle}
              </h3>
              <p class="font-normal text-[18px] mt-4 leading-tight">
                {item.description}
              </p>
              <ul>
                {item.information.map((info, infoIndex) => (
                  <li key={infoIndex} class="mb-4 flex">
                    <span class="font-medium text-[18px] mr-2 mt-3">
                      {infoIndex + 1}.
                    </span>
                    <p class="font-normal text-[18px] mt-4 leading-tight">
                      {info.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Info;
