export interface Item {
  title: string;
  href: string;
}

export interface NavItemsProps {
  items?: Item[];
}

function ItemsAboutUs({ items = [] }: NavItemsProps) {
  return (
    <div class="w-full">
      <div class="flex flex-row justify-center p-4 lg:pt-8 lg:pb-4 border-b-[1px] max-w-[1108px] mx-auto whitespace-nowrap overflow-x-auto">
        {items.map((item, index) => (
          <a
            href={item.href}
            key={index}
            class={`mx-4 hover:underline py-[6px] lg:px-3 hover:bg-[#F8F9FA] ${
              index === 0 ? "ml-[110px] lg:ml-0" : ""
            }`}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ItemsAboutUs;
