export interface Paragrafo {
  paragrafo?: string;
}

export interface DownTextInterface {
  text?: Paragrafo[];
  autor?: string;
  cargo?: string;
}

function DownText({ text = [], autor, cargo }: DownTextInterface) {
  return (
    <div class="mx-auto max-w-[910px] p-4 justify-center items-center border-b-[1px] mb-4">
      <div class="max-w-[810px] mx-auto text-left text-lg">
        <div>
          {text.map((p, index) => (
            <p key={index} class="mb-4">
              {p.paragrafo}
            </p>
          ))}
        </div>
        <p>{autor}</p>
        <p class="mb-8">{cargo}</p>
      </div>
    </div>
  );
}

export default DownText;
