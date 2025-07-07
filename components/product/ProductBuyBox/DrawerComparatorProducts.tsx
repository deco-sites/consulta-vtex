import { useUI } from "../../../sdk/useUI.ts";
import Icon from "../../../components/ui/Icon.tsx";
import { ProductOfferShippingQuote } from "./ProductBuyBox.tsx";
import { Product } from "../../../commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../../sdk/clx.ts";
import { useSignal } from "@preact/signals";
import ProductBuyBoxBuy from "./ProductBuyBoxBuy.tsx";

interface Props {
  shippingQuotes: ProductOfferShippingQuote[] | null;
  product: Product;
  pricePerMeasureMedicine?:
    | {
      measure: string | null | undefined;
      quantidadeDivisoria: number | null;
    }
    | false;
  shippingQuotesPartners: ProductOfferShippingQuote[] | null;
}

function DrawerComparatorProducts({
  shippingQuotes,
  product,
  pricePerMeasureMedicine,
  shippingQuotesPartners,
}: Props) {
  const { displayComparatorDrawer } = useUI();

  const { name, image } = product;
  const [front] = image ?? [];

  const activeTab = useSignal("cheapest");

  const allShippingQuotes = [
    ...(shippingQuotes ?? []),
    ...(shippingQuotesPartners ?? []),
  ];

  // Remover duplicatas com base no 'id'
  const uniqueShippingQuotes = allShippingQuotes.filter(
    (quote, index, self) =>
      index === self.findIndex((q) => q.name === quote.name),
  );

  console.log(uniqueShippingQuotes);

  const clickCollects = shippingQuotesPartners?.filter((quote) =>
    quote.name.includes("|")
  );
  const shippings = shippingQuotes?.filter(
    (quote) => !quote.name.includes("|"),
  );

  const bestOffers = shippings && shippings?.length > 0
    ? shippingQuotes
      ?.sort((a, b) => a.totalValue! - b.totalValue!)
      .filter((quote) => !quote.name.includes("|"))
    : null;

  const bestShipping = shippings && shippings?.length > 0
    ? shippings?.sort((a, b) => a.deadline! - b.deadline!)
    : null;

  const bestClickCollects = clickCollects && clickCollects?.length > 0
    ? clickCollects?.sort((a, b) => a.value! - b.value!)
    : null;

  const worseOfferQuotes = shippingQuotes && shippingQuotes?.length > 0
    ? shippingQuotes?.reduce((worse, current) =>
      !worse || current.offer.price! > worse.offer.price! ? current : worse
    )
    : null;

  // Verificar se há dados para cada tipo de oferta
  const hasFastestOffers = bestShipping && bestShipping.length > 0;
  const hasCheapestOffers = bestOffers && bestOffers.length > 0;
  const hasClickCollectOffers = bestClickCollects &&
    bestClickCollects.length > 0;

  const buttonCount = [
    hasFastestOffers,
    hasCheapestOffers,
    hasClickCollectOffers,
  ].filter(Boolean).length;

  const buttonWidthClass = buttonCount === 1
    ? "w-full"
    : buttonCount === 2
    ? "w-1/2"
    : "";

  // Definir a aba padrão baseada nas ofertas disponíveis
  if (activeTab.value === "fastest" && !hasFastestOffers) {
    if (hasCheapestOffers) {
      activeTab.value = "cheapest";
    } else if (hasClickCollectOffers) {
      activeTab.value = "click-collect";
    }
  } else if (activeTab.value === "cheapest" && !hasCheapestOffers) {
    if (hasFastestOffers) {
      activeTab.value = "fastest";
    } else if (hasClickCollectOffers) {
      activeTab.value = "click-collect";
    }
  } else if (activeTab.value === "click-collect" && !hasClickCollectOffers) {
    if (hasCheapestOffers) {
      activeTab.value = "cheapest";
    } else if (hasFastestOffers) {
      activeTab.value = "fastest";
    }
  }

  return (
    <div
      onClick={() => (displayComparatorDrawer.value = false)}
      class={`fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300 ${
        displayComparatorDrawer.value
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(event) => event?.stopPropagation()}
        class={`fixed top-0 right-0 w-full max-w-[90%] lg:w-[400px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          displayComparatorDrawer.value ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div class="px-4 pb-4 flex mt-4 justify-between w-full items-center border-b border-neutral">
          <p class="text-lg font-medium flex gap-6">Outras opções de ofertas</p>
          <button
            onClick={() => (displayComparatorDrawer.value = false)}
            class="text-gray-600 hover:text-gray-900 flex items-center justify-center"
          >
            <Icon id="XMark" size={24} strokeWidth={2} />
          </button>
        </div>
        <div class="flex p-4 border-b border-neutral gap-3">
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={100}
            height={160}
            style={{ aspectRatio: `${100} / ${140}` }}
            class={clx("min-w-[70px] max-w-[70px] w-full h-auto object-cover")}
            sizes="(max-width: 640px) 50vw, 20vw"
            decoding="async"
          />
          <p class="text-info tracking-[.009375rem]">{name}</p>
        </div>

        {/* Renderizar botões apenas se houver pelo menos uma oferta disponível */}
        {(hasFastestOffers || hasCheapestOffers || hasClickCollectOffers) && (
          <div class="w-full py-4 px-2 border-b flex justify-evenly items-center gap-1 bg-white">
            {/* Botão Mais Rápida - só renderiza se houver ofertas de entrega */}
            {hasFastestOffers && (
              <button
                class={`btn btn-sm text-nowrap filter-button rounded font-light text-xs lg:text-sm px-1 ${buttonWidthClass} ${
                  activeTab.value === "fastest"
                    ? "btn-primary text-white"
                    : "btn-light text-secondary-content bg-[#DAE0E5]"
                }`}
                onClick={() => (activeTab.value = "fastest")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4"
                >
                  <g clip-path="url(#clip0_259_281)">
                    <path
                      d="M7.5861 24C7.43074 24.0003 7.27761 23.9629 7.13988 23.891C6.94936 23.7921 6.79678 23.6332 6.70579 23.4388C6.61479 23.2443 6.59047 23.0253 6.63658 22.8157L8.6809 13.6201H2.97341C2.79582 13.6202 2.62158 13.5717 2.4696 13.4799C2.31761 13.388 2.19367 13.2563 2.11121 13.099C2.02876 12.9417 1.99093 12.7648 2.00184 12.5876C2.01274 12.4103 2.07196 12.2394 2.17307 12.0934L10.2453 0.418982C10.3351 0.289867 10.4548 0.18435 10.5941 0.111404C10.7334 0.0384582 10.8883 0.00024026 11.0456 0H19.1191C19.2998 0 19.4769 0.0503115 19.6306 0.145297C19.7843 0.240283 19.9085 0.376189 19.9893 0.537788C20.0701 0.699387 20.1043 0.880294 20.0881 1.06024C20.0718 1.24018 20.0058 1.41205 19.8974 1.55659L15.024 8.0748H20.2723C20.4606 8.07491 20.6449 8.12968 20.8027 8.23249C20.9606 8.33529 21.0852 8.4817 21.1614 8.65393C21.2376 8.82617 21.2622 9.01683 21.2322 9.20278C21.2022 9.38872 21.1188 9.56195 20.9922 9.70144L8.30732 23.6757C8.21656 23.7773 8.10545 23.8587 7.9812 23.9145C7.85695 23.9704 7.72233 23.9995 7.5861 24ZM4.82835 11.677H9.89374C10.0395 11.6768 10.1835 11.7094 10.315 11.7723C10.4465 11.8353 10.5621 11.9271 10.6533 12.0408C10.7445 12.1546 10.8089 12.2874 10.8418 12.4294C10.8747 12.5714 10.8752 12.7191 10.8433 12.8613L9.33208 19.6545L18.0749 10.0205H13.0809C12.9002 10.0205 12.7231 9.97023 12.5694 9.87524C12.4157 9.78025 12.2915 9.64435 12.2107 9.48275C12.1299 9.32115 12.0957 9.14024 12.1119 8.9603C12.1281 8.78036 12.1942 8.60849 12.3026 8.46395L17.176 1.94833H11.5567L4.82835 11.677Z"
                      fill="#333333"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_259_281">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Mais rápida
              </button>
            )}

            {/* Botão Mais Barata - só renderiza se houver ofertas */}
            {hasCheapestOffers && (
              <button
                class={`btn btn-sm text-nowrap filter-button rounded font-light text-xs lg:text-sm px-1 ${buttonWidthClass} ${
                  activeTab.value === "cheapest"
                    ? "btn-primary text-white"
                    : "btn-light text-secondary-content bg-[#DAE0E5]"
                }`}
                onClick={() => (activeTab.value = "cheapest")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4"
                >
                  <g clip-path="url(#clip0_199_236)">
                    <path
                      d="M22.7941 10.2917C23.1359 10.2257 23.4437 10.042 23.6641 9.77244C23.8844 9.50292 24.0032 9.16468 23.9999 8.81658V7.04878C24.0006 6.77956 23.948 6.51287 23.8452 6.26402C23.7425 6.01517 23.5916 5.78907 23.4012 5.5987C23.2109 5.40833 22.9848 5.25744 22.7359 5.1547C22.4871 5.05196 22.2204 4.99939 21.9512 5.00001H2.04878C1.5056 5.00063 0.984848 5.21668 0.600762 5.60076C0.216677 5.98485 0.000625415 6.5056 5.70092e-06 7.04878V8.81658C-0.000957728 9.16587 0.120218 9.5045 0.342562 9.77388C0.564906 10.0433 0.874428 10.2264 1.21756 10.2917C1.69703 10.3703 2.13266 10.6176 2.44602 10.9889C2.75938 11.3602 2.92989 11.8312 2.92683 12.3171C2.93142 12.8021 2.7612 13.2725 2.44731 13.6423C2.13343 14.0121 1.69688 14.2565 1.21756 14.3307C0.874428 14.396 0.564906 14.5791 0.342562 14.8485C0.120218 15.1179 -0.000957728 15.4565 5.70092e-06 15.8058V17.5853C0.00246935 18.1279 0.219113 18.6476 0.6028 19.0313C0.986487 19.415 1.50617 19.6316 2.04878 19.6341H21.9512C22.4943 19.6335 23.0151 19.4174 23.3992 19.0334C23.7833 18.6493 23.9993 18.1285 23.9999 17.5853V15.8058C24.0032 15.4577 23.8844 15.1195 23.6641 14.85C23.4437 14.5804 23.1359 14.3967 22.7941 14.3307C22.3139 14.2538 21.8768 14.0082 21.5612 13.6381C21.2457 13.268 21.0724 12.7976 21.0724 12.3112C21.0724 11.8248 21.2457 11.3544 21.5612 10.9843C21.8768 10.6142 22.3139 10.3686 22.7941 10.2917ZM22.2438 16.0166V17.5853C22.2442 17.6239 22.2368 17.6621 22.2222 17.6977C22.2076 17.7334 22.1861 17.7657 22.1588 17.793C22.1316 17.8202 22.0992 17.8418 22.0635 17.8564C22.0279 17.871 21.9897 17.8783 21.9512 17.878H8.78047V17C8.78047 16.7671 8.68796 16.5438 8.52329 16.3791C8.35863 16.2144 8.13529 16.1219 7.90242 16.1219C7.66955 16.1219 7.44621 16.2144 7.28155 16.3791C7.11688 16.5438 7.02437 16.7671 7.02437 17V17.878H2.04878C2.01026 17.8783 1.97206 17.871 1.93641 17.8564C1.90076 17.8418 1.86837 17.8202 1.84113 17.793C1.81389 17.7657 1.79234 17.7334 1.77774 17.6977C1.76314 17.6621 1.75579 17.6239 1.7561 17.5853V16.0166C2.58997 15.8186 3.33268 15.3451 3.86412 14.6727C4.39556 14.0003 4.68465 13.1683 4.68465 12.3112C4.68465 11.4541 4.39556 10.6221 3.86412 9.94974C3.33268 9.27734 2.58997 8.80385 1.7561 8.60585V7.04878C1.75579 7.01026 1.76314 6.97206 1.77774 6.93641C1.79234 6.90076 1.81389 6.86837 1.84113 6.84113C1.86837 6.81389 1.90076 6.79234 1.93641 6.77774C1.97206 6.76314 2.01026 6.75579 2.04878 6.7561H7.02437V7.63414C7.02437 7.86702 7.11688 8.09035 7.28155 8.25502C7.44621 8.41968 7.66955 8.51219 7.90242 8.51219C8.13529 8.51219 8.35863 8.41968 8.52329 8.25502C8.68796 8.09035 8.78047 7.86702 8.78047 7.63414V6.7561H21.9512C21.9897 6.75579 22.0279 6.76314 22.0635 6.77774C22.0992 6.79234 22.1316 6.81389 22.1588 6.84113C22.1861 6.86837 22.2076 6.90076 22.2222 6.93641C22.2368 6.97206 22.2442 7.01026 22.2438 7.04878V8.60585C21.41 8.80385 20.6673 9.27734 20.1358 9.94974C19.6044 10.6221 19.3153 11.4541 19.3153 12.3112C19.3153 13.1683 19.6044 14.0003 20.1358 14.6727C20.6673 15.3451 21.41 15.8186 22.2438 16.0166Z"
                      fill="#333333"
                    />
                    <path
                      d="M7.88837 14.6164C7.6555 14.6164 7.43217 14.5239 7.2675 14.3592C7.10283 14.1945 7.01033 13.9712 7.01033 13.7383V10.8735C7.01033 10.6407 7.10283 10.4173 7.2675 10.2527C7.43217 10.088 7.6555 9.9955 7.88837 9.9955C8.12124 9.9955 8.34458 10.088 8.50924 10.2527C8.67391 10.4173 8.76642 10.6407 8.76642 10.8735V13.7383C8.76642 13.9712 8.67391 14.1945 8.50924 14.3592C8.34458 14.5239 8.12124 14.6164 7.88837 14.6164Z"
                      fill="#333333"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_199_236">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Mais barata
              </button>
            )}

            {/* Botão Clique & Retire - só renderiza se houver ofertas de click collect */}
            {hasClickCollectOffers && (
              <button
                class={`btn btn-sm text-nowrap filter-button rounded font-light text-xs lg:text-sm px-1 ${buttonWidthClass} ${
                  activeTab.value === "click-collect"
                    ? "btn-primary text-white"
                    : "btn-light text-secondary-content bg-[#DAE0E5]"
                }`}
                onClick={() => (activeTab.value = "click-collect")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.4249 20.1982C15.2064 20.1982 14.9939 20.1147 14.8359 19.9148C14.0214 18.8855 11.8243 15.9164 10.382 13.9271C9.88109 13.2373 10.2335 10.9547 10.2335 10.4367C10.2335 10.3533 10.1998 10.3169 10.1436 10.3169C9.85346 10.3169 8.95094 11.2579 8.72725 11.6544C8.45865 12.1311 8.35415 12.3731 8.26088 13.5826C8.23842 13.8709 7.89987 14.0634 7.58032 14.0634C7.29186 14.0634 7.01981 13.9064 7.00944 13.5215C6.98267 12.4855 7.22017 10.9886 7.73059 10.3153C8.30147 9.56185 9.8025 8.18222 10.7422 7.94017C10.8872 7.90299 11.0729 7.88482 11.2698 7.88482C11.6697 7.88482 12.1205 7.96 12.3857 8.10209C13.0049 8.43584 13.834 9.78655 14.4334 10.1525C14.8074 10.3814 16.0372 10.2674 16.6504 10.3401C17.6307 10.4574 17.5192 11.8576 16.7402 11.8576H16.7238C16.2652 11.8453 15.8179 11.8411 15.4068 11.8411C14.2158 11.8411 13.3219 11.8783 13.3219 11.8783L13.2666 13.7652C13.2666 13.7652 15.6063 17.7281 16.3421 19.002C16.6677 19.567 16.0251 20.1982 15.4249 20.1982ZM10.1731 18.3445C10.1066 18.5048 9.43553 19.0492 8.4147 19.9315C8.13919 20.1686 7.88182 20.2611 7.659 20.2611C7.05271 20.2611 6.71502 19.5688 7.05789 19.1937C7.43963 18.7757 8.58138 17.6233 8.8327 17.3193C9.08403 17.0144 9.58667 15.2829 9.58667 15.2829L10.7932 16.9665C10.7932 16.9665 10.2405 18.1842 10.1731 18.3445ZM11.3442 3.73942C12.124 3.73942 12.7554 4.34414 12.7554 5.08931C12.7554 5.8353 12.124 6.44084 11.3442 6.44084C10.5643 6.44084 9.93295 5.8353 9.93295 5.08931C9.93295 4.34414 10.5643 3.73942 11.3442 3.73942ZM14.5719 13.456L14.5823 13.0859C14.8319 13.0826 15.1108 13.0802 15.4071 13.0802C15.8069 13.0802 16.2422 13.0851 16.6887 13.0959C16.7008 13.0959 16.7293 13.0967 16.7405 13.0967C17.7597 13.0967 18.5784 12.3127 18.6458 11.2718C18.7183 10.1739 17.9289 9.24447 16.8114 9.11064C16.5194 9.07594 16.1904 9.07263 15.8406 9.07015C15.6117 9.0685 15.2533 9.0652 15.0547 9.04455C14.8992 8.89667 14.6341 8.58439 14.4657 8.38447C14.0166 7.85328 13.5899 7.35595 13.0795 7.06102C13.6685 6.58518 14.0511 5.88297 14.0511 5.08907C14.0511 3.66153 12.8368 2.5 11.3444 2.5C9.85204 2.5 8.63774 3.66153 8.63774 5.08907C8.63774 5.88793 9.02466 6.59344 9.61971 7.06929C8.43046 7.69383 7.1868 8.92063 6.68243 9.58731C5.86541 10.6654 5.69009 12.587 5.71513 13.5527C5.74104 14.5672 6.52524 15.3024 7.58063 15.3024C7.82504 15.3024 8.05391 15.2512 8.27155 15.1777C8.08759 15.7841 7.876 16.3929 7.77495 16.6003C7.60913 16.7861 7.17557 17.2347 6.8517 17.571C6.54165 17.8923 6.24542 18.1996 6.08305 18.3781C5.59077 18.9159 5.4854 19.671 5.80754 20.35C6.13919 21.0481 6.86638 21.5 7.65922 21.5C8.0565 21.5 8.66019 21.3876 9.28289 20.8515L9.88399 20.3352C10.9299 19.4405 11.2106 19.2001 11.3764 18.8044C11.4135 18.7143 11.6001 18.3013 11.7564 17.9559C12.6114 19.1067 13.3835 20.1319 13.8033 20.6623C14.1919 21.1547 14.7844 21.4372 15.4252 21.4372C16.2275 21.4372 17.016 21.001 17.4323 20.3244C17.8054 19.7197 17.8218 19.0018 17.4764 18.402C16.864 17.3438 15.1324 14.4053 14.5719 13.456Z"
                    fill="#231F20"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.20906 14.8291C2.81869 14.8291 2.5 15.1348 2.5 15.5082V16.9423C2.5 17.3157 2.81869 17.6206 3.20906 17.6206C3.59943 17.6206 3.91812 17.3157 3.91812 16.9423V15.5082C3.91812 15.1348 3.59943 14.8291 3.20906 14.8291Z"
                    fill="#231F20"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.44194 16.9418V15.5084C6.44194 15.1342 6.12239 14.8285 5.73202 14.8285C5.34251 14.8285 5.02209 15.1342 5.02209 15.5084V16.9418C5.02209 17.3152 5.34251 17.62 5.73202 17.62C6.12239 17.62 6.44194 17.3152 6.44194 16.9418Z"
                    fill="#231F20"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.0318 14.8291C17.6414 14.8291 17.3228 15.1348 17.3228 15.5082V16.9423C17.3228 17.3157 17.6414 17.6206 18.0318 17.6206C18.4222 17.6206 18.7409 17.3157 18.7409 16.9423V15.5082C18.7409 15.1348 18.4222 14.8291 18.0318 14.8291Z"
                    fill="#231F20"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.791 14.8291C20.4006 14.8291 20.0811 15.1348 20.0811 15.5082V16.9423C20.0811 17.3157 20.4006 17.6206 20.791 17.6206C21.1805 17.6206 21.5 17.3157 21.5 16.9423V15.5082C21.5 15.1348 21.1805 14.8291 20.791 14.8291Z"
                    fill="#231F20"
                  />
                </svg>
                Clique & Retire
              </button>
            )}
          </div>
        )}

        {/* Renderizar mensagem quando não há ofertas disponíveis */}
        {!hasFastestOffers && !hasCheapestOffers && !hasClickCollectOffers && (
          <div class="flex justify-center items-center py-8">
            <p class="text-gray-500 text-center">
              Nenhuma oferta disponível no momento.
            </p>
          </div>
        )}

        <div class="overflow-y-auto h-[calc(100%-270px)] divide-y">
          {bestShipping &&
            activeTab.value == "fastest" &&
            bestShipping?.map((offer, index) => (
              <ProductBuyBoxBuy
                bestOfferRegion={offer}
                worseOfferQuotes={worseOfferQuotes}
                product={product}
                position={index}
                name="Fastest"
                title="Oferta mais rápida"
                description="Oferta com menor tempo de entrega."
                pricePerMeasureMedicine={pricePerMeasureMedicine}
              />
            ))}
          {bestOffers &&
            activeTab.value == "cheapest" &&
            bestOffers?.map((offer, index) => (
              <ProductBuyBoxBuy
                bestOfferRegion={offer}
                worseOfferQuotes={worseOfferQuotes}
                product={product}
                position={index}
                name="BestOffer"
                title="Melhor Oferta"
                description="Melhor oferta selecionada com base no custo total, qualidade da loja e preço. Pode incluir ou não o menor preço total."
                pricePerMeasureMedicine={pricePerMeasureMedicine}
              />
            ))}
          {bestClickCollects &&
            activeTab.value == "click-collect" &&
            bestClickCollects?.map((offer, index) => (
              <ProductBuyBoxBuy
                bestOfferRegion={offer}
                worseOfferQuotes={worseOfferQuotes}
                product={product}
                position={index}
                name="Retire"
                title="Oferta Clique & Retire"
                description="Melhor oferta para retirada em loja."
                pricePerMeasureMedicine={pricePerMeasureMedicine}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default DrawerComparatorProducts;
