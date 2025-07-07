import Icon from "../../../components/ui/Icon.tsx";
import { useUI } from "../../../sdk/useUI.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

// Função para obter o CEP dos cookies (executado apenas no cliente)
const getCepFromCookies = (): string => {
  if (typeof window === "undefined") return ""; // Evita erro no SSR
  const matches = typeof document !== "undefined"
    ? document.cookie.match(/user_cep=([^;]+)/)
    : null;
  return matches ? decodeURIComponent(matches[1]) : "";
};

export default function CepButton() {
  const { displayCepDrawer, cepDrawer } = useUI();
  const cep = useSignal<string>("");
  const isLoading = useSignal<boolean>(true);

  // Obtém o CEP apenas no cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      cep.value = cepDrawer.value || getCepFromCookies();
      isLoading.value = false;
    }
  }, [cepDrawer.value]);

  return (
    <button
      onClick={() => (displayCepDrawer.value = true)}
      type="button"
      class="bg-transparent border border-transparent text-white text-sm flex items-center px-2 py-1 rounded hover:bg-accent focus:outline-none hover:border-white"
    >
      <Icon id="Location" size={16} stroke="1" class="text-white" />
      <span class="mx-2">
        {isLoading.value
          ? "Carregando..."
          : cep.value
          ? `Enviar para: ${cep.value}`
          : "Digite seu CEP"}
      </span>
      <Icon
        id="ArrowCep"
        size={16}
        stroke="1"
        class="text-white"
      />
    </button>
  );
}
