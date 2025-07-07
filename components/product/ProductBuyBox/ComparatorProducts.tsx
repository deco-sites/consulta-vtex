import Button from "../../../components/ui/Button.tsx";
import { useUI } from "../../../sdk/useUI.ts";

function ComparatorProducts() {
  const { displayComparatorDrawer } = useUI();
  function openComparator() {
    displayComparatorDrawer.value = true;

    console.log(displayComparatorDrawer.value);
  }
  return (
    <section class="mt-2">
      <div class="flex flex-col border border-neutral rounded-lg">
        <div class="p-4 bg-[#cfe2ff]" style="border-radius:5px 5px 0px 0px;">
          <h2 class="text-info font-semibold">Compare Ofertas e Preços</h2>
        </div>
        <div class="p-4 border-top border-neutral">
          <Button
            onClick={openComparator}
            class="p-0 pl-0 pr-0 text-primary underline"
          >
            Compare em outras farmácias
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ComparatorProducts;
