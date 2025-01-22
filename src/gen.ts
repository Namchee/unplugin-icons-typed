import type { IconifyInfo } from '@iconify/types';
import { IconPack, PreviewCache, TypeGenerator } from "./types";

const getDisplayDimension = (viewBox: [number, number], info: IconifyInfo): [number, number] => {
  let [a, b] = viewBox;
  if (a > b) {
    [a, b] = [b, a];
  }

  const height = info.displayHeight || (Array.isArray(info.height) ? info.height[0] : info.height) || 24;
  const width = Math.round(a * height / b);

  return [width, height];
}

const generatePreview = (icon: string, viewBox: [number, number], dimension: [number, number]) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension[0]}" height="${dimension[1]}" viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" fill="black" stroke="black"><rect width="100%" height="100%" fill="white" />${icon}</svg>`;

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

export function generatePreviewCache(iconPacks: IconPack[]): PreviewCache {
  const cache: Record<string, Record<string, string>> = {};
  for (const pack of iconPacks) {
    cache[pack.info.name] = {};

    for (const [key, data] of Object.entries(pack.data.icons)) {
      const viewBox: [number, number] = [
        data.width || pack.data.width || 24,
        data.height || pack.data.height || 24,
      ];
      const dimension = getDisplayDimension(viewBox, pack.info);

      const preview = Buffer.from(generatePreview(data.body, viewBox, dimension)).toString("base64");

      cache[pack.info.name][key] = preview;
    }
  }

  return cache;
}

export function generateDeclarationFile(iconPacks: IconPack[], generator: TypeGenerator, cache: PreviewCache) {
  let declaration = `${generator.header ? generator.header + "\n" : ""}`;

  for (const pack of iconPacks) {
    let packDeclaration = `/* ${pack.info.name} pack */\n`;

    packDeclaration += generateSubmodule(pack.data.prefix);

    for (const [key, _] of Object.entries(pack.data.icons)) {
      packDeclaration += generator.generateIconTypeDeclaration(key, cache[pack.info.name][key], pack.data.prefix, pack.info);
    }

    if (pack.data.aliases) {
      for (const [key, data] of Object.entries(pack.data.aliases)) {
        packDeclaration += generator.generateAliasTypeDeclaration(key, data.parent, pack.data.prefix, pack.info, cache[pack.info.name][key]);
      }
    }

    packDeclaration += `\n/* End of ${pack.info.name} */\n\n`;

    declaration += packDeclaration;
  }

  return declaration;
}
