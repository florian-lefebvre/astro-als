import { z } from "astro/zod";

const DEFAULTS = {
	configFile: "als.config",
	clientId: "astro-als-data",
};

export const optionsSchema = z
	.object({
		configFile: z.string().default(DEFAULTS.configFile),
		clientId: z.string().default(DEFAULTS.clientId),
	})
	.default(DEFAULTS);
