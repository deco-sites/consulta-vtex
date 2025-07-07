import { getCookies } from "std/http/cookie.ts";

const LOGIN_COOKIE = "sf_customer_access_token";

export const getUserCookie = (headers: Headers): string | undefined => {
  const cookies = getCookies(headers);

  return cookies[LOGIN_COOKIE];
};
