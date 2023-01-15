import type { LayoutLoad } from "@/../.svelte-kit/types/src/routes/$types.d";
export const prerender = true;
export const ssr = false;
export const trailingSlash = "always";

export const load: LayoutLoad = ({ url }) => {
  const currentRoute = url.pathname;

  return {
    currentRoute,
  };
};
