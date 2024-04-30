import { als } from "virtual:astro-als/internal/als";
import { config } from "virtual:astro-als/internal/config";
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	return als.run(await config.seedData(context), next);
});
