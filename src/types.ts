import type { IconifyInfo, IconifyJSONIconsData } from '@iconify/types';

export type PreviewCache = Record<string, Record<string, string>>;

export type IconPack = {
  data: IconifyJSONIconsData;
  info: IconifyInfo;
}

export type TypeGenerator = {
  preProcessing?: (content: string) => string;
  postProcessing?: (content: string) => string;
  generateIconTypeDeclaration: (icon: string, preview: string, pack: string, info: IconifyInfo) => string;
  generateAliasTypeDeclaration: (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => string;
}


