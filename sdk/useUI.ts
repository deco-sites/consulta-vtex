/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { signal } from "@preact/signals";
import { Person } from "../commerce/types.ts";

const displayCart = signal(false);
const displayMenu = signal(false);
const displaySearchPopup = signal(false);
const displaySearchDrawer = signal(false);
const displayCepDrawer = signal(false);
const displayShippingDrawer = signal(false);
const sellerIdValue = signal(0);
const displayComparatorDrawer = signal(false);
const cepDrawer = signal("");
const pmcValue = signal(0);
const isLoged = signal(false);
const personValue = signal<Person | null>(null);
const accessToken = signal<string | null | undefined>(null);
const tokenValidete = signal(false);

const state = {
  displayCart,
  displayMenu,
  displaySearchPopup,
  displaySearchDrawer,
  displayCepDrawer,
  cepDrawer,
  displayShippingDrawer,
  displayComparatorDrawer,
  pmcValue,
  isLoged,
  personValue,
  sellerIdValue,
  accessToken,
  tokenValidete,
};

// Keyboard event listeners
addEventListener("keydown", (e: KeyboardEvent) => {
  const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;

  // Open Searchbar on meta+k
  if (e.metaKey === true && isK) {
    displaySearchPopup.value = true;
  }
});

export const useUI = () => state;
