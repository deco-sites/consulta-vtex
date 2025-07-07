import { useEffect } from "preact/hooks";
import Icon from "../../components/ui/Icon.tsx";
import { invoke } from "../../runtime.ts";
import { useSignal } from "@preact/signals";
import { Person } from "../../commerce/types.ts";
import { useUI } from "../../sdk/useUI.ts";

function UserLogin() {
  const userLogin = useSignal<Person | null>(null);
  const isLoading = useSignal(true);

  function removeCookiesLogin() {
    document.cookie = "sf_customer_access_token" +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const invokedUser = await invoke.site.loaders.user();

        const hasEmail = invokedUser?.email && invokedUser.email.trim() !== "";
        const hasId = invokedUser?.["@id"] && invokedUser["@id"].trim() !== "";

        const hashedEmail = hasEmail
          ? await hashString(invokedUser?.email)
          : null;
        const hashedId = hasId ? await hashString(invokedUser["@id"]) : null;

        const dataLayerPayload = {
          user_id: hashedId,
          user_mail: hashedEmail,
          user_cr: null,
        };

        globalThis.window.dataLayer = globalThis.window.dataLayer || [];
        globalThis.window.dataLayer.push(dataLayerPayload);

        // Atualiza signals e estado do usuário
        userLogin.value = invokedUser;
        const { isLoged, personValue } = useUI();
        isLoged.value = Boolean(invokedUser);
        personValue.value = invokedUser;
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        isLoading.value = false;
      }
    }

    fetchUser();
  }, []);

  const user = userLogin.value;

  const isLoggedIn = !!user?.email;

  return isLoggedIn
    ? (
      <div class="relative group">
        <button
          class="font-proxima-nova font-normal flex-col text-nowrap items-start text-[14px] text-[#E1E1E1] hover:text-white flex"
          type="button"
        >
          <strong>Olá,</strong>
          {""}
          {user?.givenName && user?.givenName.length > 10
            ? `${user?.givenName.slice(0, 10)}...`
            : user?.givenName}
        </button>
        <div class="hidden absolute z-10 bg-white rounded-lg px-4 py-5 group-hover:flex flex-col w-[140px]">
          <a
            class="text-xs font-normal leading-16 text-nowrap hover:font-semibold"
            href="/account/my-data"
          >
            Minha Conta
          </a>
          <a
            class="text-xs font-normal leading-16 text-nowrap py-2 hover:font-semibold"
            href="/account"
          >
            Meus Pedidos
          </a>
          <a
            class="text-xs font-normal leading-16 text-nowrap pb-2 hover:font-semibold"
            href="/account/addresses"
          >
            Meus endereços
          </a>
          <a
            class="font-proxima-nova text-xs font-normal leading-16 text-primary text-nowrap hover:font-semibold"
            href="/"
            onClick={removeCookiesLogin}
          >
            Sair
          </a>
        </div>
      </div>
    )
    : isLoading.value
    ? (
      <p>
        <span class="text-white font-light">Loading...</span>
      </p>
    )
    : (
      <a
        class="flex gap-1 items-center px-2 py-2 hover:bg-accent rounded cursor-pointer"
        href="/login/authenticate"
      >
        <div class="flex gap-1">
          <Icon id="User" size={20} strokeWidth={1} class="text-white" />
        </div>
        <p class="text-white font-light">Entrar</p>
      </a>
    );
}

export default UserLogin;

async function hashString(str: string | undefined) {
  // Converte a string em um ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Gera o hash SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Converte o ArrayBuffer do hash em uma string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Converte o ArrayBuffer em um array de bytes
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(""); // Converte os bytes para hexadecimal

  return hashHex;
}
