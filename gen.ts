import { resolve } from "node:path";

import { readdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

type IconifyJSON = {
  icons: Record<string, { body: string }>;
  aliases?: Record<string, { parent: string }>;
}

type IconifyInfo = {
  prefix: string;
  name: string;
  height: number;
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

const generatePreview = (icon: string, dimension: [number, number]) => `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension[0]}" height="${dimension[1]}" viewBox="0 0 ${dimension[0]} ${dimension[1]}"><rect width="100%" height="100%" fill="white" />${icon}</svg>`;

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

const generateIconTypeDeclaration = (icon: string, preview: string, info: IconifyInfo) => `
declare module 'virtual:icons/${info.prefix}/${icon}' {
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

declare module '~icons/${info.prefix}/${icon}' {
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

const generateAliasTypeDeclaration = (icon: string, alias: string, info: IconifyInfo) => `
declare module 'virtual:icons/${info.prefix}/${icon}' {
  /**
   * \`${icon}\` from ${info.name} pack.
   * Alias of \`${alias}\`.
   *
   * @author ${info.author.name}
   * @see ${info.author.url}
   */
  const component: string;
  export default component;
};

declare module '~icons/${info.prefix}/${icon}' {
  /**
   * \`${icon}\` from ${info.name} pack.
   * Alias of \`${alias}\`.
   *
   * @author ${info.author.name}
   */
  const component: string;
  export default component;
};
`;

function generateDeclarationFile(iconPacks: IconPack[]) {
  let declaration = '';

  for (const pack of iconPacks) {
    let packDeclaration = `/* ${pack.info.name} icon pack */\n`;

    packDeclaration += generateSubmodule(pack.info.prefix);

    for (const [key, data] of Object.entries(pack.data.icons)) {
      const preview = Buffer.from(generatePreview(data.body, [pack.info.height, pack.info.height])).toString("base64");

      packDeclaration += generateIconTypeDeclaration(key, preview, pack.info);
    }

    if (pack.data.aliases) {
      for (const [key, data] of Object.entries(pack.data.aliases)) {
        packDeclaration += generateAliasTypeDeclaration(key, data.parent, pack.info);
      }
    }

    packDeclaration += `/* End of ${pack.info.name} */\n`;

    declaration += packDeclaration;
  }

  return declaration;
}

const dts = generateDeclarationFile(iconDef);
writeFileSync("./.unplugin/type.d.ts", dts);
