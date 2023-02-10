import type { PageLoad } from "./$types";

// ここだけSPAモードにする（内容をプリレンダリングできないため）.
export const prerender = false;
export const load = (({ params }) => {
  return {
    id: params.id,
  };
}) satisfies PageLoad;
