import type { FilterToggleValue } from "apps/commerce/types.ts";

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  // console.log("url", url);
  const newUrl = new URL(url);

  function handleClick() {
    globalThis.window.location.href = newUrl.pathname + newUrl.search;
  }

  return (
    <div onClick={handleClick} class="flex items-center gap-2">
      <div
        aria-checked={selected}
        class="checkbox rounded border-neutral w-5 h-5"
      >
      </div>
      <span class="text-sm">
        {label}({quantity})
      </span>
    </div>
  );
}

export default ValueItem;
