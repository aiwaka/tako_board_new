// import adapter from "@sveltejs/adapter-auto";
import staticAdapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter: adapter(),
    adapter: staticAdapter({
      fallback: "index.html",
      pages: "dist",
      precompress: false,
    }),
  },
};

export default config;
