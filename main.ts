import { resolve } from "node:path";
import { existsSync, readdirSync, writeFileSync } from "node:fs";

import { readFile } from "node:fs/promises";

import { VanillaTypeGenerator } from "./src/vanilla";
import { ReactTypeGenerator } from "./src/react";
import { VueTypeGenerator } from "./src/vue";
import { AstroTypeGenerator } from "./src/astro";
import { PreactTypeGenerator } from "./src/preact";
import { QwikTypeGenerator } from "./src/qwik";
import { SolidTypeGenerator } from "./src/solid";
import { SvelteTypeGenerator } from "./src/svelte";
import { Svelte3TypeGenerator } from "./src/svelte3";
import { Svelte4TypeGenerator } from "./src/svelte4";
import { WebComponentTypeGenerator } from "./src/web-components";

import { generatePreviewCache, generateDeclarationFile } from "./src/gen";

import mri from "mri";

import type { IconPack } from "./src/types";

const basePackDir = resolve(process.cwd(), "node_modules", "@iconify-json");
const baseIconifyDir = resolve(
  process.cwd(),
  "node_modules",
  "@iconify",
  "json"
);

const hasAllIconPack = existsSync(baseIconifyDir);

let iconDef: IconPack[] = [];

const argv = process.argv.slice(2);

const args = mri(argv);


if (hasAllIconPack) {
  const defPath = readdirSync(basePackDir);

  iconDef = await Promise.all(
    defPath.map(async (path) => {
      const [icons, meta] = await Promise.all([
        readFile(resolve(basePackDir, path, "icons.json")),
        readFile(resolve(basePackDir, path, "info.json")),
      ]);

      return {
        data: JSON.parse(icons.toString("utf-8")),
        info: JSON.parse(meta.toString("utf-8")),
      };
    })
  );
} else {
  // Don't do this
  // const iconifyJson = readdirSync(
  //   resolve(baseIconifyDir, "json")
  // );
  // iconDef = await Promise.all(
  //   iconifyJson.map(async (path) => {
  //     const file = await readFile(
  //       resolve(baseIconifyDir, "json", path),
  //     );
  //     const { info, ...rest } = await JSON.parse(file.toString("utf-8"));
  //     return {
  //       data: rest,
  //       info,
  //     };
  //   })
  // );
}

const generatorMap = {
  "vanilla.d.ts": VanillaTypeGenerator,
  "react.d.ts": ReactTypeGenerator,
  "vue.d.ts": VueTypeGenerator,
  "astro.d.ts": AstroTypeGenerator,
  "preact.d.ts": PreactTypeGenerator,
  "qwik.d.ts": QwikTypeGenerator,
  "solid.d.ts": SolidTypeGenerator,
  "svelte3.d.ts": Svelte3TypeGenerator,
  "svelte4.d.ts": Svelte4TypeGenerator,
  "svelte5.d.ts": SvelteTypeGenerator,
  "web-components.d.ts": WebComponentTypeGenerator,
};

const cache = generatePreviewCache(iconDef);

for (const [file, generator] of Object.entries(generatorMap)) {
  const declaration = generateDeclarationFile(iconDef, generator, cache);

  writeFileSync(resolve(process.cwd(), ".unplugin", file), declaration);
}
