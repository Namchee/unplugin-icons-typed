import { resolve } from "node:path";

import { readdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

import type { IconifyInfo, IconifyJSONIconsData } from '@iconify/types';

type IconPack = {
  data: IconifyJSONIconsData;
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

const getDisplayDimension = (viewBox: [number, number], info: IconifyInfo): [number, number] => {
  let [a, b] = viewBox;
  if (a > b) {
    [a, b] = [b, a];
  }

  const height = info.displayHeight || (Array.isArray(info.height) ? info.height[0] : info.height) || 24;
  const width = Math.round(a * height / b);

  return [width, height];
}

const generatePreview = (icon: string, viewBox: [number, number], dimension: [number, number]) => `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension[0]}" height="${dimension[1]}" viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" fill="black" stroke="black"><rect width="100%" height="100%" fill="white" />${icon}</svg>`;

const generateSubmodule = (pack: string) => `
declare module '~icons/${pack}' {
  const _error: never;
  export = _error;
}
  
declare module 'virtual:icons/${pack}' {
  const _error: never;
  export = _error;
}
`;

const generateIconTypeDeclaration = (icon: string, preview: string, pack: string, info: IconifyInfo) => `
declare module 'virtual:icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack 
   * 
   * @author ${info.author.name}
   * @see ${info.author.url}
   */
  const component: string;
  export default component;
};

declare module '~icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack
   * 
   * @author ${info.author.name}
   * @see ${info.author.url}
   */
  const component: string;
  export default component;
};
`;

const generateAliasTypeDeclaration = (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => `
declare module 'virtual:icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack.
   * Alias of \`${alias}\`.
   *
   * @author ${info.author.name}
   * @see ${info.author.url}
   */
  const component: string;
  export default component;
};

declare module '~icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack.
   * Alias of \`${alias}\`.
   *
   * @author ${info.author.name}
   * @see ${info.author.url}
   */
  const component: string;
  export default component;
};
`;

function generateDeclarationFile(iconPacks: IconPack[]) {
  let declaration = '';

  for (const pack of iconPacks) {
    let packDeclaration = `/* ${pack.info.name} pack */\n`;

    packDeclaration += generateSubmodule(pack.data.prefix);

    const cache: Record<string, string> = {};

    for (const [key, data] of Object.entries(pack.data.icons)) {
      const viewBox: [number, number] = [
        data.width || pack.data.width || 24,
        data.height || pack.data.height || 24,
      ];
      const dimension = getDisplayDimension(viewBox, pack.info);

      const preview = Buffer.from(generatePreview(data.body, viewBox, dimension)).toString("base64");

      cache[key] = preview;

      packDeclaration += generateIconTypeDeclaration(key, preview, pack.data.prefix, pack.info);
    }

    if (pack.data.aliases) {
      for (const [key, data] of Object.entries(pack.data.aliases)) {
        packDeclaration += generateAliasTypeDeclaration(key, data.parent, pack.data.prefix, pack.info, cache[data.parent]);
      }
    }

    packDeclaration += `/* End of ${pack.info.name} */\n`;

    declaration += packDeclaration;
  }

  return declaration;
}

const dts = generateDeclarationFile(iconDef);
writeFileSync("./.unplugin/type.d.ts", dts);
