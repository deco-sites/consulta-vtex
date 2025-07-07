import Button from "../ui/Button.tsx";
import Icon from "deco-sites/consul-remedio/components/ui/Icon.tsx";

interface Props {
  quantity: number;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (quantity: number) => void;
}

const QUANTITY_MAX_VALUE = 100;

function QuantitySelector({ onChange, quantity, disabled, loading }: Props) {
  const decrement = () => onChange?.(Math.max(0, quantity - 1));

  const increment = () =>
    onChange?.(Math.min(quantity + 1, QUANTITY_MAX_VALUE));

  return (
    <div class="flex items-center border border-[#343A40] p-1 rounded">
      <Button
        class="p-0 pl-0"
        onClick={decrement}
        disabled={disabled}
        loading={loading}
      >
        <Icon id={"DecrementButton"} size={25} />
      </Button>
      <input
        class=" flex items-center justify-center text-center font-medium"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        max={QUANTITY_MAX_VALUE}
        min={1}
        value={quantity}
        disabled={disabled}
        onBlur={(e) => onChange?.(e.currentTarget.valueAsNumber)}
        maxLength={3}
        size={3}
      />

      <Button
        class="p-0 pr-0"
        onClick={increment}
        disabled={disabled}
        loading={loading}
      >
        <Icon id={"IncrementButton"} size={25} />
      </Button>
    </div>
  );
}

export default QuantitySelector;
