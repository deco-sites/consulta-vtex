import { AppContext } from "../../apps/site.ts";
import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import Drawers from "../../islands/Header/Drawers.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Alert from "./Alert.tsx";
import Navbar from "./Navbar.tsx";
import { headerHeight } from "./constants.ts";
import { type SectionProps } from "@deco/deco";
import { Route } from "apps/website/flags/audience.ts";
import { redirect } from "@deco/deco";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
/** @titleBy label */
export interface NavItemsSecondary {
  label: string;
  href?: string;
  image?: ImageWidget;
  target?: string;
}

export interface NavItemsMobile {
  label: string;
  href?: string;
  image?: ImageWidget;
  target?: string;
}
export interface Buttons {
  hideAccountButton?: boolean;
  hideWishlistButton?: boolean;
  hideCartButton?: boolean;
}
export interface Props {
  alerts?: string[];
  /** @title Search Bar */
  searchbar?: Omit<SearchbarProps, "platform">;
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;
  /** @title Logo */
  logo?: Logo;
  buttons?: Buttons;
  navItemsSecondary?: NavItemsSecondary[];
  navItemsMobile?: NavItemsMobile[];
}
function Header({
  alerts,
  searchbar,
  navItems,
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  buttons,
  navItemsSecondary,
  navItemsMobile,
}: SectionProps<typeof loader>) {
  const platform = usePlatform();
  const items = navItems ?? [];
  const itemsMob = navItemsMobile ?? [];
  const itemsDesk = navItemsSecondary ?? [];
  return (
    <>
      <header class="top-0 z-[100]" style={{ height: headerHeight }}>
        <Drawers
          menu={{ items, itemsMob, itemsDesk }}
          searchbar={searchbar}
          platform={platform}
        >
          <div class="bg-primary w-full z-50">
            {alerts && alerts.length > 0 && <Alert alerts={alerts} />}
            <Navbar
              items={items}
              searchbar={searchbar && { ...searchbar, platform }}
              logo={logo}
              buttons={buttons}
              navItemsSecondary={navItemsSecondary}
            />
          </div>
        </Drawers>
      </header>
    </>
  );
}
export const loader = async (props: Props, _req: Request, ctx: AppContext) => {
  const urlPath = await ctx.invoke.site.loaders.Redirects();

  if (urlPath) {
    redirect(urlPath, 301);
  }

  return { ...props, device: ctx.device };
};
export default Header;
