import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

function WishlistSection() {
  const userLogged = useSignal<string | null>(null);

  useEffect(() => {
    const getTokenUserFromCookies = (): string | null => {
      const match = document.cookie.match(
        /(^|;)\s*sf_customer_access_token\s*=\s*([^;]+)/,
      );
      return match ? match[2] : null;
    };

    userLogged.value = getTokenUserFromCookies();
  }, []);

  if (!userLogged.value) {
    return (
      <div className="flex justify-center my-20">
        <div className="flex items-center justify-center flex-col gap-5">
          <p className="text-sm lg:text-base">
            Faça login para ter acesso ao sua lista de favoritos
          </p>
          <a
            className="bg-primary w-[300px] h-10 flex items-center uppercase justify-center font-semibold text-white rounded"
            href="/login/authenticate?returnUrl=/favoritos"
          >
            Faça login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="my-20 flex justify-center text-4xl">
      <h2>Sua lista está vazia.</h2>
    </div>
  );
}

export default WishlistSection;
