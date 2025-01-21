import { resolve } from "node:path";
import { readdirSync, writeFileSync } from "node:fs";

import { readFile } from "node:fs/promises";

import { VanillaTypeGenerator } from './src/vanilla';
import { ReactTypeGenerator } from './src/react';
import { VueTypeGenerator } from './src/vue';
import { AstroTypeGenerator } from './src/astro';

import { generatePreviewCache, generateDeclarationFile } from './src/gen';

import type { IconPack } from './src/types';

const baseIconifyDir = resolve(process.cwd(), "node_modules", "@iconify-json");
const defPath = readdirSync(baseIconifyDir);

const iconDef: IconPack[] = await Promise.all(
  defPath.map(async (path) => {
    const [icons, meta] = await Promise.all([
      readFile(
        resolve(baseIconifyDir, path, 'icons.json'),
      ),
      readFile(
        resolve(baseIconifyDir, path, 'info.json'),
      ),
    ]);

    return {
      data: JSON.parse(icons.toString("utf-8")),
      info: JSON.parse(meta.toString("utf-8")),
    }
  })
);

const generatorMap = {
  'vanilla.d.ts': VanillaTypeGenerator,
  'react.d.ts': ReactTypeGenerator,
  'vue.d.ts': VueTypeGenerator,
  'astro.d.ts': AstroTypeGenerator,
}

const cache = generatePreviewCache(iconDef);

for (const [file, generator] of Object.entries(generatorMap)) {
  const declaration = generateDeclarationFile(iconDef, generator, cache);

  writeFileSync(resolve(process.cwd(), '.unplugin', file), declaration);
} 
