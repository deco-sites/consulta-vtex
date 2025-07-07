import { type Section } from "@deco/deco/blocks";
interface Props {
  children: Section;
}
function Gallery({ children: { Component, props } }: Props) {
  return (
    <>
      <Component {...props} class="text-info" />
    </>
  );
}
export default Gallery;
