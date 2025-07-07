import { ImageWidget } from "apps/admin/widgets.ts";

export interface ImageComponentProps {
  image?: ImageWidget;
  alt?: string;
  width?: number;
  height?: number;
}

function ImageComponent({ image, alt }: ImageComponentProps) {
  if (!image) return null;

  return (
    <div class="flex justify-center items-center">
      <img
        height={470}
        width={1000}
        class="pt-4 lg:p-6 lg:w-[1108px] max-md:object-cover"
        src={image}
        alt={alt ?? "Estamos aqui em todas as etapas da sua jornada de saúde."}
        loading={"lazy"}
      />
    </div>
  );
}

export default ImageComponent;
