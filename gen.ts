import { resolve } from "node:path";

import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";

type IconifyJSON = {
  icons: Record<string, { body: string }>[];
  aliases: Record<string, { parent: string }>[];
}

type IconifyInfo = {
  name: string;
  author: {
    name: string;
    url: string;
  }
}

type IconPack = {
  data: IconifyJSON;
  info: IconifyInfo;
}

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

console.log(iconDef);

// const generateType = (icon: string) => {
//   return `
// declare module 'virtual:icons/lucide/${icon}' {
//   const component: string;
//   export default component;
// }

// declare module '~icons/lucide/${icon}' {
//   const component: string;
//   export default component;
// }
// `;
// };

// const type = [
//   ...new Set([
//     ...Object.keys(iconDef[0].icons),
//     ...Object.keys(iconDef[0].aliases),
//   ]),
// ].reduce((acc, val) => {
//   return [acc, generateType(val)].join("");
// }, "");

// writeFileSync("./.unplugin/type.d.ts", type);
