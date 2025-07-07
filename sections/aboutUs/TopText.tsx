export interface TopText {
  title?: string;
  subtitle?: string;
  description?: string;
  isTop: boolean;
}

function TopText({ title, subtitle, description, isTop = true }: TopText) {
  return isTop
    ? (
      <div class="mx-auto max-w-[910px] p-4 justify-center items-center border-b-[1px]">
        <div class="max-w-[810px] mx-auto text-left">
          <h1 class="text-[56px] pt-8 pb-4 leading-none font-medium max-[770px]">
            {title}
          </h1>
          <h2 class="text-[28px] font-medium py-4">{subtitle}</h2>
          <p class="text-lg font-normal py-4">{description}</p>
        </div>
      </div>
    )
    : (
      <div class="mx-auto max-w-[910px] p-4 justify-center items-center border-b-[1px]">
        <div class="max-w-[810px] mx-auto text-left">
          <h2 class="text-[56px] pt-8 pb-4 leading-none font-medium max-[770px]">
            {title}
          </h2>
          <h3 class="text-[28px] font-medium py-4">{subtitle}</h3>
          <p class="text-lg font-normal py-4">{description}</p>
        </div>
      </div>
    );
}

export default TopText;
