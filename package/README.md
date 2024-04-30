# `astro-als`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to avoid hydration mismatches by getting the data on both server and client using an AsyncLocalStorage.

## Usage

### Prerequisites

When using the Cloudflare adapter, you'll need to [enable AsyncLocalStorage manually](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#enable-only-asynclocalstorage).

### Limitations

- All data must be serializable
- The data will be be made static on prerendered pages

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-als
```

```bash
npx astro add astro-als
```

```bash
yarn astro add astro-als
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-als
```

```bash
npm install astro-als
```

```bash
yarn add astro-als
```

2. Add the integration to your astro config

```diff
+import als from "astro-als";

export default defineConfig({
  integrations: [
+    als(),
  ],
});
```

### Create a config file

In your project root, create a new `als.config.ts` file:

```ts
// als.config.ts
import { defineAlsConfig } from "astro-als/config";

export default defineAlsConfig({
	seedData(context) {
		return {
			// Your serializable data here
		};
	},
});
```

This code will be run in a post middleware. The best practise is to only use the `seedData` function to return data without causing any side-effects.

### Use the component

In a shared layout, import `AlsSerialize.astro`:

```astro
---
// src/layouts/Layout.astro
import AlsSerialize from "astro-als/AlsSerialize.astro"

interface Props {
	title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="description" content="Astro description" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
		<AlsSerialize />
	</head>
	<body>
		<slot />
	</body>
</html>
```

### Use the data

You can now import the data server (within a request) and client side using `getAlsData`:

```vue
<script setup lang="ts">
// src/components/Test.vue
import { getAlsData } from "als:astro";

const data = getAlsData();
</script>

<template>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
</template>
```

```astro
---
// src/pages/index.astro
import Layout from "../layouts/Layout.astro";
import Test from "../components/Test.vue";
---

<Layout title="Welcome to Astro.">
	<Test client:load />
</Layout>

```

### Integration configuration

Here is the TypeScript type:

```ts
export type Options = {
  configFile?: string;
  cliendId?: string;
}
```

#### `configFile`

Config file path for the integration, relative to the root directory. Defaults to `"als.config"`.

```ts
import als from "astro-als";

export default defineConfig({
  integrations: [
    als({
      configFile: "./my-custom-config.mjs"
    }),
  ],
});
```

#### `clientId`

Id used in the DOM to store the data. Defaults to `"astro-als-data"`.

```ts
import als from "astro-als";

export default defineConfig({
  integrations: [
    als({
      clientId: "my-custom-id"
    }),
  ],
});
```

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/florian-lefebvre/astro-als/blob/main/LICENSE). Made with ❤️ by [Florian Lefebvre](https://github.com/astro-als).
