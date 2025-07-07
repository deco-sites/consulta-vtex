import { useSignal } from "@preact/signals";
import { invoke } from "../../runtime.ts";
import Icon from "../../components/ui/Icon.tsx";

export interface Props {
  productID: number;
}

function Notify({ productID }: Props) {
  const loading = useSignal(false);
  const successMessage = useSignal<string | null>(null); // Para armazenar a mensagem de sucesso

  const handleSubmit = async (
    e: Event & { currentTarget: HTMLFormElement },
  ) => {
    e.preventDefault();

    try {
      loading.value = true;
      const email = (
        e.currentTarget.elements.namedItem("email") as RadioNodeList
      )?.value;
      const name = "";

      await invoke.wake.actions.notifyme({
        productVariantId: productID,
        name,
        email,
      });

      successMessage.value = "Envio realizado com sucesso!"; // Exibe a mensagem de sucesso após a notificação
    } catch (_error) {
      successMessage.value = null; // Caso haja erro, não mostramos a mensagem
    } finally {
      loading.value = false;
    }
  };

  return (
    <form class="flex flex-col items-start gap-3 mt-3" onSubmit={handleSubmit}>
      <span>Notifique-me quando estiver disponível</span>
      <div class="w-full flex gap-3">
        <input
          placeholder="Email"
          class="outline-none border border-neutral p-2 w-full rounded "
          name="email"
          required
          type="email"
        />
        <button
          class="btn disabled:loading font-normal rounded bg-primary hover:bg-accent duration-300 hover:scale-95 text-white"
          disabled={loading}
        >
          <Icon id="Bell" width={16} height={16} sizes="16" strokeWidth={1} />
          Notifique-me
        </button>
      </div>
      {(successMessage.value?.length ?? 0) > 1 && (
        <div class="ml-2 text-green-500">{successMessage.value}</div> // Exibe a mensagem de sucesso em verde
      )}
    </form>
  );
}

export default Notify;
