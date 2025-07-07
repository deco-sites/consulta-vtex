import Icon from "../../../components/ui/Icon.tsx";
import { useUI } from "../../../sdk/useUI.ts";

export default function SearchButton() {
  const { displaySearchDrawer } = useUI();

  return (
    <>
      <div
        class="w-full lg:hidden"
        onClick={() => {
          displaySearchDrawer.value = !displaySearchDrawer.value;
        }}
      >
        <div class="pointer-events-none flex">
          <input
            class="rounded px-4 h-10 border-none focus:border-none outline-none rounded-tr-none rounded-br-none w-full"
            placeholder="Pesquise tudo na CR! Como remédios, cosméticos, doenças, artigos..."
            role="combobox"
          />
          <button
            type="submit"
            class="bg-success h-10 min-h-10 border-success w-10 flex items-center justify-center rounded rounded-bl-none rounded-tl-none hover:bg-success-content hover:border-success-content"
            aria-label="Search"
            tabIndex={-1}
          >
            <Icon id="search" size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
