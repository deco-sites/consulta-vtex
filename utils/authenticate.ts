import type { AppContext } from "apps/wake/mod.ts";
import { getUserCookie } from "../utils/user.ts";

const authenticate = (req: Request, _ctx: AppContext): string | null => {
  const loginCookie = getUserCookie(req.headers);

  if (!loginCookie) return null;

  // const data = await checkoutApi
  //   ["GET /api/Login/Get"](
  //     {},
  //     { headers: req.headers },
  //   ).then((r) => r.json());

  // if (!data?.CustomerAccessToken) return null;

  return loginCookie;
};

export default authenticate;
