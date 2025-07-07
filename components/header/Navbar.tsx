import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import Icon from "../../components/ui/Icon.tsx";
import {
  CepButton,
  MenuButton,
  SearchButton,
} from "../../islands/Header/Buttons.tsx";
import CartButtonWake from "../../islands/Header/Cart/wake.tsx";
import Searchbar from "../../islands/Header/Searchbar.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import { navbarHeight } from "./constants.ts";
import {
  Buttons,
  Logo,
  NavItemsSecondary,
} from "../../components/header/Header.tsx";
import { useDevice } from "@deco/deco/hooks";
import DrawerCep from "../../islands/Header/DrawerCep.tsx";
import UserLogin from "../../islands/UseLogin.tsx";

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar({
  items,
  searchbar,
  logo,
  buttons,
  navItemsSecondary,
}: {
  items: SiteNavigationElement[];
  searchbar?: SearchbarProps;
  logo?: Logo;
  buttons?: Buttons;
  navItemsSecondary?: NavItemsSecondary[];
}) {
  const platform = usePlatform();
  const categoriaItem = items.find((item) => item.name === "Categorias");
  const device = useDevice();

  // Mobile header
  if (device === "mobile") {
    return (
      <div>
        <div
          style={{ height: navbarHeight }}
          class="flex items-center justify-between px-4 gap-4 border-b border-white"
        >
          {logo && (
            <a href="/" class="min-w-9" aria-label="Consulta logo">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 35}
                height={logo.height || 35}
                loading={"eager"}
              />
            </a>
          )}
          <MenuButton />
          <SearchButton />
          <div class="flex justify-end min-w-8">
            {platform === "wake" && <CartButtonWake />}
          </div>
        </div>
        <div class="px-4 lg:px-10 py-2">
          <CepButton />
          <DrawerCep />
        </div>
      </div>
    );
  }

  // Desktop header
  return (
    <div class="flex flex-col">
      <div class="flex flex-row items-center gap-4 relative py-4 border-b border-white px-4  lg:px-10 ">
        <div class="flex items-center gap-4">
          {logo && (
            <a href="/" aria-label="logo" class="block min-w-9">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 35}
                height={logo.height || 35}
                loading={"eager"}
              />
            </a>
          )}
          {categoriaItem && (
            <div class="flex gap-2 items-center px-2 py-2 hover:bg-accent rounded ml-4">
              <Icon id="grid" size={24} stroke="2" class="text-white" />
              <NavItem item={categoriaItem} />
            </div>
          )}
        </div>
        <div class="flex items-center justify-end gap-6 w-full">
          {searchbar && <Searchbar {...searchbar} />}

          {/* <Searchbar searchbar={searchbar} /> */}
          {!buttons?.hideWishlistButton && (
            <a
              class="flex gap-2 items-center px-2  py-2 hover:bg-accent rounded cursor-pointer"
              href="/favoritos"
            >
              <button class="flex items-center gap-2">
                <Icon id="Heart" size={18} strokeWidth={1} />
              </button>
              <p
                href="/favoritos"
                class="text-white font-light whitespace-nowrap"
              >
                Minhas listas
              </p>
            </a>
          )}
          {!buttons?.hideAccountButton && <UserLogin />}

          {!buttons?.hideCartButton && (
            <div class="flex items-center text-xs font-thin">
              {platform === "wake" && <CartButtonWake />}
            </div>
          )}
        </div>
      </div>
      <div class="px-4 lg:px-10 py-2 w-full flex items-center justify-between">
        <CepButton />
        <DrawerCep />
        <div>
          <ul class="flex items-center justify-center gap-6 text-white font-light">
            {navItemsSecondary?.map((item) => (
              <li>
                <a
                  target={item?.target}
                  href={item?.href}
                  class="flex gap-2 items-center hover:underline text-sm"
                >
                  {item?.image && (
                    <img
                      class="text-white"
                      src={item.image}
                      alt={item.label}
                      width={24}
                      height={24}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
            {" "}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
