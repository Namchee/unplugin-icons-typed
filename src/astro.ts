import type { IconifyInfo } from '@iconify/types';
import { TypeGenerator } from './types';

const generateIconTypeDeclaration = (icon: string, preview: string, pack: string, info: IconifyInfo) => `
declare module 'virtual:icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack 
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: (props: astroHTML.JSX.SVGAttributes) => astroHTML.JSX.Element
  export default component
}

declare module '~icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: (props: astroHTML.JSX.SVGAttributes) => astroHTML.JSX.Element
  export default component
}
`;

const generateAliasTypeDeclaration = (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => `
declare module 'virtual:icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack.
   * Alias of \`${alias}\` from the same pack.
   *
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: (props: astroHTML.JSX.SVGAttributes) => astroHTML.JSX.Element
  export default component
}

declare module '~icons/${pack}/${icon}' {
  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack.
   * Alias of \`${alias}\` from the same pack.
   *
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: (props: astroHTML.JSX.SVGAttributes) => astroHTML.JSX.Element
  export default component
}
`;

export const AstroTypeGenerator: TypeGenerator = {
  header: '/// <reference types="astro/astro-jsx" />',
  generateIconTypeDeclaration,
  generateAliasTypeDeclaration,
}
