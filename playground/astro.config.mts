import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";
const { default: als } = await import("astro-als");

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		als(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
		vue(),
	],
});
