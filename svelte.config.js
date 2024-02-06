// import adapter from "@sveltejs/adapter-auto";
import staticAdapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

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
    version: {
      name: pkg.version,
    },
  },
};

export default config;
