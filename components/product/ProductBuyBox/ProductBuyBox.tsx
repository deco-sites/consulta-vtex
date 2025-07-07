import {
  OfferSellers,
  Product,
  ProductShippingQuote,
} from "../../../commerce/types.ts";
import ProductBuyBoxNoCep from "./ProductBuyBoxNoCep.tsx";
import ProductBuyBoxWithCep from "./ProductBuyBoxWithCep.tsx";
import ProductUnavailable from "./ProductUnavailable.tsx";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { invoke } from "../../../runtime.ts";
import { useUI } from "../../../sdk/useUI.ts";
import DrawerShippings from "./DrawerShippings.tsx";
import ComparatorProducts from "./ComparatorProducts.tsx";
import DrawerComparatorProducts from "./DrawerComparatorProducts.tsx";
import GenericProduct from "../GenericProduct.tsx";
import shippingQuotesAll from "../../../sdk/shippingQuotesAll.ts";
import {
  getBestOffer,
  getFastOffer,
  getWorseOffer,
} from "../../../sdk/shippingQuotes.ts";
import { useCart } from "apps/wake/hooks/useCart.ts";

// Função para obter o CEP dos cookies (executado apenas no cliente)
function getCepFromCookies(cookie: string): string {
  if (typeof window === "undefined") return ""; // Evita erro no SSR
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${cookie}=([^;]*)`),
  );
  return matches ? decodeURIComponent(matches[1]) : "";
}
export interface Props {
  productOffers: OfferSellers[];
  product: Product;
  pricePerMeasureMedicine?:
    | {
      measure: string | null | undefined;
      quantidadeDivisoria: number | null;
    }
    | false;
  productVariantIdParams?: string | null;
}

export interface ProductOfferShippingQuote {
  deadline: number;
  deadlineInHours: number | null;
  distributionCenterId: number;
  id: string | null;
  name: string;
  shippingQuoteId: string;
  type: string;
  value: number;
  products: ProductShippingQuote[];
  offer: OfferSellers;
  totalValue: number;
}

export default function ProductBuyBox({
  productOffers,
  product,
  pricePerMeasureMedicine,
  productVariantIdParams,
}: Props) {
  const { cepDrawer, pmcValue, accessToken, tokenValidete, displayCepDrawer } =
    useUI();
  const cep = useSignal<string>("");

  const { buyBox } = product;

  const { cart } = useCart();
  const { products } = cart.value;

  const offerParams = useSignal<number | null>(null);
  const offerPriceParams = useSignal<number | null>(null);
  const bestShippingRetire = useSignal<ProductOfferShippingQuote | null>(null);
  const allShippingQuotesValue = useSignal<ProductOfferShippingQuote[] | null>(
    null,
  );
  const allShippingQuotesPartners = useSignal<
    ProductOfferShippingQuote[] | null
  >(null);
  const revenueRetention = product?.additionalProperty?.find(
    (property) => property.name === "Retenção de receita",
  )?.value;

  console.log("revenueRetention", revenueRetention);

  const isLoading = useSignal<boolean>(true);
  const selected = useSignal<string>("BestOffer");

  const offersOrdened = productOffers.sort((a, b) => {
    const priceA = a.price ?? Infinity;
    const priceB = b.price ?? Infinity;
    return priceA - priceB;
  });

  useEffect(() => {
    isLoading.value = false;
    const run = async () => {
      if (typeof window !== "undefined") {
        const newCep = cepDrawer.value || getCepFromCookies("user_cep");

        if (newCep !== cep.value) {
          cep.value = newCep;
        }

        const newAcessToken = accessToken.value ||
          getCepFromCookies("partner-token-sf");
        const isTrulyStringToken = Number(newAcessToken);

        console.log(newAcessToken, "token");
        console.log(isTrulyStringToken, "token 2");
        console.log(newCep);

        console.log("quantidade de ofertas", productOffers?.length);
        console.log("before", cep.value);
        console.log("product", product);

        if (cep.value || newCep) {
          isLoading.value = true;
          try {
            if (
              newAcessToken != "null" &&
              newAcessToken &&
              typeof newAcessToken !== "number" &&
              !isTrulyStringToken
            ) {
              const productsPartner = await invoke.site.loaders.getProductOnly({
                id: Number(product.inProductGroupWithID),
                partnerToken: newAcessToken,
              });

              console.log(Number(product.inProductGroupWithID), newAcessToken);

              console.log("partner product", productsPartner);

              const bestOffers = await shippingQuotesAll({
                product: product,
                cep: cep.value,
                productOffers: offersOrdened.slice(0, 30),
              });

              const fastOffers = (await shippingQuotesAll({
                product: product,
                cep: cep.value,
                productOffers: productVariantIdParams
                  ? productsPartner?.offerSellers?.filter(
                    (offer) =>
                      offer.productID === Number(productVariantIdParams),
                  ) ?? []
                  : productsPartner?.offerSellers?.filter(
                    (item) => item.price !== 0.01,
                  ) ?? [],
              })) ?? undefined;

              console.log("Product Quote", fastOffers);

              allShippingQuotesValue.value = (bestOffers?.length ?? 0) > 0
                ? bestOffers?.filter((q) => !q?.name?.includes("|")) ?? []
                : fastOffers?.filter((q) => !q?.name?.includes("|")) ?? [];

              if (fastOffers) {
                allShippingQuotesPartners.value = fastOffers;
              } else {
                allShippingQuotesPartners.value = null;
              }
              console.log("Best Offers", bestOffers);
            } else {
              const bestOffers = await shippingQuotesAll({
                product: product,
                cep: cep.value,
                productOffers: offersOrdened
                  ?.filter((q) => !q?.name?.includes("|"))
                  ?.slice(0, 30),
              });

              allShippingQuotesValue.value = bestOffers?.filter((q) =>
                !q?.name?.includes("|")
              ) ?? [];
              bestShippingRetire.value = null;
              console.log("Best Offers No Partners", bestOffers);
            }
          } catch (error) {
            console.log(error);
          } finally {
            isLoading.value = false;
          }
        }
      }
    };

    run();
  }, [accessToken.value]);

  const bestPriceOffer = productVariantIdParams && productOffers.length > 0
    ? productOffers[0].price
    : buyBox?.minimumPrice;

  const newAllShippings = allShippingQuotesValue?.value?.map((offer) => {
    const alreadyInCart = products?.some(
      (p) => p?.productVariantId === offer.offer.productID,
    );

    const totalValue = alreadyInCart
      ? offer?.offer?.price ?? 0
      : (offer?.value ?? 0) + (offer?.offer?.price ?? 0);

    return {
      ...offer,
      totalValue,
    };
  });

  console.log("newAllShippings", allShippingQuotesValue.value);

  const newBestShippingQuotes = newAllShippings
    ? getFastOffer({
      offers: newAllShippings?.filter((q) => !q.name.includes("|")),
    })
    : null;

  const newBestOfferQuotes = getBestOffer({
    offers: newAllShippings?.filter((q) => !q.name.includes("|")),
  });

  const newWorseOfferQuotes = getWorseOffer({
    offers: allShippingQuotesValue?.value ?? undefined,
  });
  const newShippingRetire = getBestOffer({
    offers: allShippingQuotesPartners?.value?.filter((q) =>
      q.name.includes("|")
    ),
  });

  return (
    <>
      <DrawerShippings shippingQuotes={allShippingQuotesValue.value} />
      {isLoading.value
        ? (
          // Mostra loading enquanto estiver carregando
          <div class="max-lg:px-2">
            <div
              style={{ height: "700px" }}
              class="w-full h-full bg-gray-300 animate-pulse rounded-lg max-lg:mt-3"
            >
            </div>
          </div>
        )
        : !cep.value
        ? (
          // Renderiza SEM CEP após o carregamento
          <>
            <div class=" lg:sticky lg:top-3  h-fit lg:mt-0 p-2 lg:p-0">
              <h2 class="text-xl mb-1 teste1">Ofertas Recomendadas</h2>
              <ProductBuyBoxNoCep
                offerExclusive={offerParams.value}
                offerPriceExclusive={offerPriceParams.value}
                bestOffer={bestPriceOffer ?? 0}
                productOffers={productOffers}
              />
              <GenericProduct product={product} />
            </div>
          </>
        )
        : allShippingQuotesValue.value?.length ||
            allShippingQuotesPartners.value?.length
        ? (
          // Renderiza COM CEP e ofertas disponíveis
          <>
            <div class=" lg:sticky lg:top-3  h-fit lg:mt-0 p-2 lg:p-0">
              <div class="flex flex-col gap-3">
                <h2 class="text-xl mb-1 teste2">Ofertas Recomendadas</h2>
                {revenueRetention !== "Sim" && (
                  <>
                    {newBestOfferQuotes && (
                      <ProductBuyBoxWithCep
                        title="Melhor Oferta"
                        bestOfferRegion={newBestOfferQuotes}
                        worseOfferQuotes={newWorseOfferQuotes}
                        product={product}
                        name="BestOffer"
                        selected={selected}
                        description="Melhor oferta selecionada com base no custo total, qualidade da loja e preço. Pode incluir ou não o menor preço total."
                        pricePerMeasureMedicine={pricePerMeasureMedicine}
                      />
                    )}

                    {newBestShippingQuotes && (
                      <ProductBuyBoxWithCep
                        title="Oferta mais rápida"
                        bestOfferRegion={newBestShippingQuotes}
                        worseOfferQuotes={newWorseOfferQuotes}
                        product={product}
                        name="Fastest"
                        selected={selected}
                        description="Oferta com menor tempo de entrega."
                        pricePerMeasureMedicine={pricePerMeasureMedicine}
                      />
                    )}
                  </>
                )}
                {newShippingRetire && (
                  <ProductBuyBoxWithCep
                    title="Oferta Clique & Retire"
                    bestOfferRegion={newShippingRetire}
                    worseOfferQuotes={newWorseOfferQuotes}
                    product={product}
                    name="Retire"
                    selected={selected}
                    description="Melhor oferta para retirada em loja."
                    pricePerMeasureMedicine={pricePerMeasureMedicine}
                  />
                )}
                {!newShippingRetire && revenueRetention === "Sim"
                  ? (
                    <>
                      <>
                        <ProductUnavailable
                          productId={Number(product.productID)}
                          product={product}
                        />
                      </>
                    </>
                  )
                  : <></>}
                {revenueRetention !== "Sim" || newShippingRetire
                  ? (
                    <>
                      <ComparatorProducts />
                    </>
                  )
                  : <></>}
              </div>

              <GenericProduct product={product} />
            </div>
          </>
        )
        : (
          <>
            <ProductUnavailable
              productId={Number(product.productID)}
              product={product}
            />
            <GenericProduct product={product} />
          </>
        )}
      <DrawerComparatorProducts
        shippingQuotes={newAllShippings ?? null}
        shippingQuotesPartners={allShippingQuotesPartners.value}
        product={product}
        pricePerMeasureMedicine={pricePerMeasureMedicine}
      />
    </>
  );
}
