import Button from "../../../components/ui/Button.tsx";
import Icon from "../../../components/ui/Icon.tsx";
import { useUI } from "../../../sdk/useUI.ts";

export default function MenuButton() {
  const { displayMenu } = useUI();

  return (
    <Button
      class="border border-white px-2 py-[6px] rounded bg-transparent h-auto min-h-max"
      aria-label="open menu"
      onClick={() => {
        displayMenu.value = !displayMenu.value;
      }}
    >
      <Icon
        class="relative right-[2px] bottom-[2px]"
        id="Menu"
        size={26}
        strokeWidth={0.01}
      />
    </Button>
  );
}
