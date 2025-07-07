export interface Props {
  title: string;
  textButton: string;
  href: string;
}

function EvaluationSection({ title, href, textButton }: Props) {
  return (
    <div className="bg-neutral-content py-6">
      <p className="font-bold text-center">{title}</p>
      <div className="flex justify-center mt-6">
        <a
          className="flex rounded text-white bg-primary hover:bg-accent duration-500 px-3 py-2"
          href={href}
          target="_blank"
        >
          {textButton}
        </a>
      </div>
    </div>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default EvaluationSection;
