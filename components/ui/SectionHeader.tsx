import { clx } from "../../sdk/clx.ts";

export interface Props {
  title?: string;
  fontSize?: "Small" | "Normal" | "Large";
  description?: string;
  alignment?: "center" | "left";
  colorReverse?: boolean;
  link?: string;
}

const fontSizeClasses = {
  Small: "lg:text-2xl",
  Normal: "lg:text-3xl",
  Large: "lg:text-4xl",
};

function Header(props: Props) {
  return (
    <>
      {props.title || props.description
        ? (
          <div
            class={`flex flex-col gap-2 ${
              props.alignment === "left" ? "text-left" : "text-center"
            }`}
          >
            {props.title &&
              (props.link
                ? (
                  <a
                    href={props.link}
                    class={clx(
                      "text-2xl font-medium leading-8 lg:leading-10 hover:underline",
                      props.colorReverse ? "text-primary-content" : "text-info",
                      fontSizeClasses[props.fontSize || "Normal"],
                    )}
                  >
                    <h2>{props.title}</h2>
                  </a>
                )
                : (
                  <h2
                    class={clx(
                      "text-2xl font-medium leading-8 lg:leading-10",
                      props.colorReverse ? "text-primary-content" : "text-info",
                      fontSizeClasses[props.fontSize || "Normal"],
                    )}
                  >
                    {props.title}
                  </h2>
                ))}
            {props.description && (
              <h3
                class={clx(
                  "leading-6 lg:leading-8",
                  props.colorReverse ? "text-primary-content" : "text-info",
                  fontSizeClasses[props.fontSize || "Normal"],
                )}
              >
                {props.description}
              </h3>
            )}
          </div>
        )
        : null}
    </>
  );
}

export default Header;
