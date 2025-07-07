export interface TextAboutUs {
  text: string;
}

function TextAboutUs({
  text,
}: TextAboutUs) {
  return (
    <div class="flex justify-center items-center max-w-[1256px] mx-auto p-">
      <p class="font-medium text-2xl leading-tight py-8 px-4">{text}</p>
      <div class="max-w-4xl"></div>
    </div>
  );
}

export default TextAboutUs;
