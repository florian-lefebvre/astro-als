import { defineAlsConfig } from "astro-als/config";

export default defineAlsConfig({
	seedData(context) {
		return {
			url: context.url.href,
		};
	},
});
