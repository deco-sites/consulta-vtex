import type { BreadcrumbList } from "apps/commerce/types.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  const newItems = items.filter(({ name, item }) => name && item);

  return (
    <div class="breadcrumbs overflow-auto">
      <ul>
        {newItems.map(({ name, item }, index) => {
          const isLast = index === newItems.length - 1;

          return (
            <li key={index}>
              {name === "Home" && (
                <svg
                  class="mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M5.68726 12.6867V9.61979C5.68726 9.40541 5.90601 9.18666 6.12476 9.18666H7.87476C8.09351 9.18666 8.31226 9.40541 8.31226 9.62416V12.6867C8.31226 12.8027 8.35835 12.914 8.4404 12.996C8.52244 13.0781 8.63372 13.1242 8.74976 13.1242H12.2498C12.3658 13.1242 12.4771 13.0781 12.5591 12.996C12.6412 12.914 12.6873 12.8027 12.6873 12.6867V6.56166C12.6874 6.50417 12.6761 6.44722 12.6542 6.39407C12.6323 6.34093 12.6001 6.29262 12.5595 6.25191L11.3748 5.06804V2.18666C11.3748 2.07063 11.3287 1.95935 11.2466 1.87731C11.1646 1.79526 11.0533 1.74916 10.9373 1.74916H10.0623C9.94622 1.74916 9.83494 1.79526 9.7529 1.87731C9.67085 1.95935 9.62476 2.07063 9.62476 2.18666V3.31804L7.30951 1.00191C7.26887 0.961172 7.22059 0.928847 7.16744 0.906791C7.11428 0.884736 7.0573 0.873383 6.99976 0.873383C6.94221 0.873383 6.88523 0.884736 6.83208 0.906791C6.77893 0.928847 6.73065 0.961172 6.69001 1.00191L1.44001 6.25191C1.3994 6.29262 1.36722 6.34093 1.3453 6.39407C1.32338 6.44722 1.31215 6.50417 1.31226 6.56166V12.6867C1.31226 12.8027 1.35835 12.914 1.4404 12.996C1.52244 13.0781 1.63372 13.1242 1.74976 13.1242H5.24976C5.36579 13.1242 5.47707 13.0781 5.55912 12.996C5.64116 12.914 5.68726 12.8027 5.68726 12.6867Z"
                    fill="#6C757D"
                  />
                </svg>
              )}
              {isLast || name == "Busca"
                ? <p class="text-sm text-secondary">{name}</p>
                : (
                  <a class="text-sm texts-econdary" href={item}>
                    {name}
                  </a>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Breadcrumb;
