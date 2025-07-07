import type { Manifest } from "./manifest.gen.ts";
import type { Manifest as ManifestWake } from "apps/wake/manifest.gen.ts";
import { proxy } from "@deco/deco/web";
export const invoke = proxy<Manifest & ManifestWake>();
