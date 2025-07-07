/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import ProductCard from "../../components/product/ProductCardSearchbar.tsx";
import Button from "../../components/ui/Button.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { sendEvent } from "../../sdk/analytics.tsx";
import { useId } from "../../sdk/useId.ts";
import { useSuggestions } from "../../sdk/useSuggestions.ts";
import { useUI } from "../../sdk/useUI.ts";
import { Suggestion } from "apps/commerce/types.ts";
import { useEffect, useRef } from "preact/compat";
import type { Platform } from "../../apps/site.ts";
import { type Resolved } from "@deco/deco";
import { useSignal } from "@preact/signals";
import { formatarTextoParaHref } from "../../sdk/format.ts";

// Editable props
export interface Props {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Page path
   * @description When user clicks on the search button, navigate it to
   * @default /busca
   */
  action?: string;
  /**
   * @title Term name
   * @description Querystring param used when navigating the user
   * @default busca
   */
  name?: string;
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
  platform?: Platform;
}
function Searchbar({
  placeholder =
    "Pesquise tudo na CR! Como remédios, cosméticos, doenças, artigos...",
  action = "/b",
  name = "q",
  loader,
  platform,
}: Props) {
  const id = useId();
  const { displaySearchPopup, displaySearchDrawer } = useUI();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { setQuery, payload, loading } = useSuggestions(loader);
  const { products = [], searches = [] } = payload.value ?? {};
  const hasProducts = Boolean(products?.length);
  const hasTerms = Boolean(searches.length);

  const isOpenSuggestions = useSignal(false);
  function openUserSuggestions() {
    isOpenSuggestions.value = true;
  }
  function closeUseSuggestions() {
    isOpenSuggestions.value = false;
  }

  const isPageLoaded = useSignal(false);
  const hasInitialized = useRef(false); // ← flag para controlar a primeira execução

  useEffect(() => {
    if (!hasInitialized.current) {
      addEventListener("click", closeUseSuggestions);

      isPageLoaded.value = true;
      hasInitialized.current = true;
    }

    if (displaySearchPopup.value === true) {
      searchInputRef.current?.focus();
    }

    if (displaySearchDrawer.value === true) {
      setTimeout(() => {
        const input = searchInputRef.current;
        if (input) {
          input.setAttribute("autofocus", "true");
          input.focus();
          input.click();

          const touchEvent = new TouchEvent("touchstart", {
            bubbles: true,
            cancelable: true,
          });
          input.dispatchEvent(touchEvent);
        }
      }, 100);
    }
  }, [displaySearchPopup.value, displaySearchDrawer.value]);

  function onSubmit() {
    const term = document.querySelector(
      "#search-input",
    ) as HTMLInputElement | null;
    const formattedTerm = formatarTextoParaHref(term?.value ?? "");
    if (formattedTerm) {
      location.href = `/b/${formattedTerm}`;

      if (term?.value) {
        sendEvent({
          name: "search",
          params: { search_term: term?.value },
        });
      }
    }
  }

  return (
    <div class="w-full relative p-4 lg:p-0">
      <div
        class={`join w-full h-10 max-lg:border max-lg:border-neutral max-lg:rounded`}
      >
        <input
          ref={searchInputRef}
          id="search-input"
          class="flex-grow rounded px-4 h-10 border-none focus:border-none outline-none max-lg:h-auto max-lg:rounded "
          inputMode="text"
          onInput={(e) => {
            const value = e.currentTarget.value;

            if (value.length > 0) {
              openUserSuggestions();
            } else {
              closeUseSuggestions();
            }

            setQuery(value);
          }}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
            if (e.key === "Return") {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <Button
          type="button"
          class="bg-success h-10 min-h-10 border-success w-10 flex items-center justify-center rounded rounded-bl-none rounded-tl-none hover:bg-success-content hover:border-success-content max-lg:min-h-[38px] max-lg:h-[38px]"
          aria-label="Search"
          onClick={onSubmit}
        >
          {loading.value
            ? <span class="loading loading-spinner loading-xs text-white" />
            : <Icon id="search" size={20} />}
        </Button>
      </div>
      {isOpenSuggestions.value && (
        <div
          class={`max-lg:left-0 absolute w-full bg-white px-4 lg:shadow-lg lg:px-8 py-4 rounded rounded-tl-none rounded-tr-none max-h-96 overflow-y-auto z-[1000] ${
            !hasProducts && !hasTerms ? "hidden" : ""
          }`}
        >
          <div class="">
            {
              /* <div class="flex flex-col gap-6">
          <span class="font-medium text-xl" role="heading" aria-level={3}>
            Sugestões
          </span>
          <ul id="search-suggestion" class="flex flex-col gap-6">
            {searches.map(({ term }) => (
              <li>
                <a
                  href={`/b/${term.toLowerCase().replace(/\s+/g, "-")}`}
                  class="flex gap-4 items-center"
                >
                  <span dangerouslySetInnerHTML={{ __html: term }} />
                </a>
              </li>
            ))}
          </ul>
        </div> */
            }
            <div class="flex flex-col pt-6 md:pt-0 overflow-x-hiddeng">
              {products?.map((product, index) => (
                <div class="divide-y flex flex-col">
                  <ProductCard
                    product={product}
                    platform={platform}
                    index={index}
                    itemListName="Suggeestions"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Searchbar;
