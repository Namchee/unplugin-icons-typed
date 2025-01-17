import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { globSync } from "tinyglobby";

const defPath = globSync("./node_modules/@iconify-json/lucide/icons.json");
const iconDef = await Promise.all(
  defPath.map(async (path) => {
    const content = await readFile(path);

    return JSON.parse(content.toString('utf-8'));
  })
);

const generateType = (icon: string) => {
  return `
declare module '~icons/lucide/${icon}' {
  const component: string;
  export default component;
}
`
}

const type = Object.entries(iconDef[0].icons).reduce((acc, [key, value]) => {
  return [acc, generateType(key)].join('');
}, '');

writeFileSync('./.unplugin/type.d.ts', type);

