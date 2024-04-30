import { defineIntegration } from "astro-integration-kit";

export const integration = defineIntegration({
	name: "astro-als",
	setup() {
		return {
			hooks: {},
		};
	},
});
