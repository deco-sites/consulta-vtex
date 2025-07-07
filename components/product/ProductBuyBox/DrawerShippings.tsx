import { useUI } from "../../../sdk/useUI.ts";
import Icon from "../../../components/ui/Icon.tsx";
import { ProductOfferShippingQuote } from "./ProductBuyBox.tsx";
import { formatPriceNew } from "../../../sdk/format.ts";

interface Props {
  shippingQuotes: ProductOfferShippingQuote[] | null;
}

function DrawerShippings({ shippingQuotes }: Props) {
  const { displayShippingDrawer, sellerIdValue } = useUI();

  const shippingQuotesFiltered = shippingQuotes
    ?.filter((item) => sellerIdValue.value === item.distributionCenterId)
    ?.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.deadline === item.deadline),
    );

  return (
    <div
      onClick={() => (displayShippingDrawer.value = false)}
      class={`fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300 ${
        displayShippingDrawer.value
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()} // Impede que o clique no drawer feche o overlay
        class={`fixed top-0 right-0 w-full  max-w-[95%] lg:w-[400px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          displayShippingDrawer.value ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div class="px-4 pb-4 flex mt-4 justify-between w-full items-center border-b border-neutral">
          <p class="text-lg font-medium flex gap-6">
            {" "}
            <button
              onClick={() => (displayShippingDrawer.value = false)}
              class="text-gray-600 hover:text-gray-900 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <g clip-path="url(#clip0_24602_23532)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.9996 7.99975C15.9996 8.26494 15.8943 8.51926 15.7068 8.70678C15.5193 8.89429 15.2649 8.99964 14.9997 8.99964H3.41504L7.70856 13.2912C7.80153 13.3841 7.87527 13.4945 7.92558 13.616C7.9759 13.7374 8.00179 13.8676 8.00179 13.9991C8.00179 14.1306 7.9759 14.2607 7.92558 14.3822C7.87527 14.5037 7.80153 14.614 7.70856 14.707C7.61559 14.8 7.50523 14.8737 7.38376 14.924C7.2623 14.9743 7.13211 15.0002 7.00064 15.0002C6.86917 15.0002 6.73898 14.9743 6.61752 14.924C6.49605 14.8737 6.38568 14.8 6.29272 14.707L0.293388 8.70767C0.200272 8.61479 0.126395 8.50445 0.0759874 8.38297C0.0255801 8.2615 -0.000366211 8.13127 -0.000366211 7.99975C-0.000366211 7.86823 0.0255801 7.738 0.0759874 7.61652C0.126395 7.49505 0.200272 7.38471 0.293388 7.29183L6.29272 1.2925C6.48047 1.10475 6.73512 0.999268 7.00064 0.999268C7.26616 0.999268 7.52081 1.10475 7.70856 1.2925C7.89631 1.48025 8.00179 1.7349 8.00179 2.00042C8.00179 2.26594 7.89631 2.52059 7.70856 2.70834L3.41504 6.99986H14.9997C15.2649 6.99986 15.5193 7.10521 15.7068 7.29272C15.8943 7.48024 15.9996 7.73456 15.9996 7.99975Z"
                    fill="gray"
                  >
                  </path>
                </g>
                <defs>
                  <clipPath id="clip0_24602_23532">
                    <rect width="16" height="16" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
            </button>
            Opções de entrega
          </p>
          <button
            onClick={() => (displayShippingDrawer.value = false)}
            class="text-gray-600 hover:text-gray-900 flex items-center justify-center"
          >
            <Icon id="XMark" size={24} strokeWidth={2} />
          </button>
        </div>
        <div class="p-4">
          <div
            class="flex gap-3 items-center bg-[#cfe2ff] border border-[#9ec5fe] p-4 rounded-lg "
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle w-6"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
              <path d="m8.93 6.588-.5 4a.5.5 0 0 1-.99-.142l.5-4a.5.5 0 0 1 .99.142zM8 5.5a.535.535 0 1 1 0-1.07.535.535 0 0 1 0 1.07z" />
            </svg>

            <div class="text-[#052c65]">
              As opções de entrega poderão ser selecionadas no Carrinho
            </div>
          </div>
          <div class="p-4 overflow-y-auto h-[calc(100vh-150px)]">
            {shippingQuotesFiltered?.map((quotes) => {
              const today = new Date();
              const future = new Date(today);
              future.setDate(today.getDate() + (quotes?.deadline ?? 0));

              const dayWeekend = future.toLocaleDateString("pt-BR", {
                weekday: "long",
              });
              const month = future.toLocaleDateString("pt-BR", {
                month: "long",
              });
              const day = future.getDate();

              return (
                <div>
                  <div class="text-info font-light text-sm py-2">
                    {quotes.name.includes("|")
                      ? (
                        <span>
                          Clique & Retire:{" "}
                          {future.getDate() === today.getDate() && (
                            <span>
                              <span class="font-medium">Hoje</span>
                              {" "}
                            </span>
                          )}
                        </span>
                      )
                      : today.getDate() === future.getDate()
                      ? (
                        <span>
                          Chegará <span class="font-medium">Hoje</span>,
                        </span>
                      )
                      : <span>Chegará</span>}{" "}
                    <span class="font-medium">
                      {quotes?.deadline !== 1 &&
                          future.getDate() !== today.getDate()
                        ? dayWeekend
                        : "amanhã"}
                      , {day} de {month},
                    </span>{" "}
                    {quotes?.value === 0
                      ? (
                        <span class="text-success uppercase font-medium">
                          {" "}
                          GRÁTIS
                        </span>
                      )
                      : <span>por {formatPriceNew(quotes?.value ?? 0)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawerShippings;
