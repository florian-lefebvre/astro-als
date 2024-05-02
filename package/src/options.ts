import { z } from "astro/zod";

const DEFAULTS = {
	configFile: "als.config",
	clientId: "astro-als-data",
};

export const optionsSchema = z
	.object({
		/**
		 * @description Config file path for the integration, relative to the root directory.
		 * @default "als.config"
		 */
		configFile: z.string().default(DEFAULTS.configFile),
		/**
		 * @description Id used in the DOM to store the data.
		 * @default `"astro-als-data"`
		 */
		clientId: z.string().default(DEFAULTS.clientId),
		/**
		 * @description Disables validation of the ALS Config file, eg. when there are
		 * conflicts with other packages.
		 * @default `false`
		 */
		disableConfigValidation: z.boolean().default(false),
	})
	.default(DEFAULTS);
