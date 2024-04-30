import type { AlsConfig } from "./types.js";

export const defineAlsConfig = <TConfig extends AlsConfig>(config: TConfig) =>
	config;
