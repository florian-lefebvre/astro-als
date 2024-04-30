import type { APIContext } from "astro";
import type { z } from "astro/zod";
import type { optionsSchema } from "./options.js";

type Awaitable<T> = Promise<T> | T;

export type AlsConfig<TData = unknown> = {
	seedData: (context: APIContext) => Awaitable<TData>;
};

export type Options = z.infer<typeof optionsSchema>;
