import { fileURLToPath } from "node:url";
import {
	addDts,
	addVirtualImports,
	addVitePlugin,
	createResolver,
	defineIntegration,
	watchDirectory,
} from "astro-integration-kit";
import { AstroError } from "astro/errors";
import { normalizePath } from "vite";
import { optionsSchema } from "./options.js";

const VIRTUAL_IMPORT_INTERNAL_ALS_ID = "virtual:astro-als/internal/als";
const VIRTUAL_IMPORT_INTERNAL_CONFIG_ID = "virtual:astro-als/internal/config";
const VIRTUAL_IMPORT_INTERNAL_USER_CONFIG_ID =
	"virtual:astro-als/internal/user-config";
const VIRTUAL_IMPORT_ID = "als:astro";

export const integration = defineIntegration({
	name: "astro-als",
	optionsSchema,
	setup({ options, name }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			hooks: {
				"astro:config:setup": (params) => {
					watchDirectory(params, resolve());

					const alsConfigPath = normalizePath(
						fileURLToPath(new URL(options.configFile, params.config.root)),
					);
					const stringifiedAlsConfigPath = JSON.stringify(alsConfigPath);

					if (!options.disableConfigValidation) {
						addVitePlugin(params, {
							plugin: {
								name: "astro-als-validate-als-config",
								async configureServer(server) {
									try {
										const mod = await server.ssrLoadModule(alsConfigPath);
										if (!mod.default) {
											throw new AstroError(
												`Als config located at ${stringifiedAlsConfigPath} has no default export`,
											);
										}
										if (typeof mod.default?.seedData !== "function") {
											throw new AstroError(
												`Als config located at ${stringifiedAlsConfigPath} has an invalid default export`,
												"Use `defineAlsConfig` exported from `astro-als/config`",
											);
										}
									} catch (err) {
										console.error(err);
										if (err instanceof AstroError) {
											throw err;
										}
										throw new AstroError(
											`Als config located at ${stringifiedAlsConfigPath} could not be found`,
										);
									}
								},
							},
						});
					}

					params.addWatchFile(alsConfigPath);

					addVirtualImports(params, {
						name,
						imports: [
							{
								id: VIRTUAL_IMPORT_INTERNAL_ALS_ID,
								content: `import { AsyncLocalStorage } from "node:async_hooks";
export const als = new AsyncLocalStorage();`,
								context: "server",
							},
							{
								id: VIRTUAL_IMPORT_INTERNAL_CONFIG_ID,
								content: `import * as mod from ${stringifiedAlsConfigPath};
export const config = mod.default;`,
							},
							{
								id: VIRTUAL_IMPORT_INTERNAL_USER_CONFIG_ID,
								content: `export const userConfig = ${JSON.stringify(options)}`,
							},
							{
								id: VIRTUAL_IMPORT_ID,
								content: `import { als } from ${JSON.stringify(
									VIRTUAL_IMPORT_INTERNAL_ALS_ID,
								)};
export const getAlsData = () => als.getStore();`,
								context: "server",
							},
							{
								id: VIRTUAL_IMPORT_ID,
								content: `import { userConfig } from ${JSON.stringify(
									VIRTUAL_IMPORT_INTERNAL_USER_CONFIG_ID,
								)};
export const getAlsData = () => JSON.parse(document.getElementById(userConfig.clientId).textContent);`,
								context: "client",
							},
						],
					});

					addDts(params, {
						name,
						content: `declare module ${JSON.stringify(VIRTUAL_IMPORT_ID)} {
type AlsConfig = typeof import(${stringifiedAlsConfigPath})["default"]
export const getAlsData: () => Awaited<ReturnType<AlsConfig["seedData"]>>;
}`,
					});

					params.addMiddleware({
						entrypoint: resolve("../assets/middleware.ts"),
						order: "post",
					});
				},
			},
		};
	},
});
