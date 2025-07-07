export interface Props {
  title: string;
  description: string;
  href: string;
  items: {
    label: string;
    href: string;
  }[];
}

function CategoryAZ({ title, href, description, items }: Props) {
  return (
    <section className="flex flex-col max-w-[1366px] px-4 lg:px-10 mx-auto py-8 ">
      <div>
        <a href={href}>
          <h3 className="text-[24px] hover:underline mb-1 leading-7 font-medium">
            {title}
          </h3>
        </a>
        <p class="text-secondary leading-normal">{description}</p>
      </div>
      <div class="flex w-full pr-2 lg:pr-0 overflow-auto gap-2 lg:flex-wrap mt-8 pb-2">
        {items?.map((item) => (
          <a className="flex" href={item.href}>
            <div className="flex justify-center items-center bg-primary hover:bg-accent text-white h-9 min-w-[38px] rounded hover:scale-[.9] hover:underline duration-300">
              <span>{item.label}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default CategoryAZ;
