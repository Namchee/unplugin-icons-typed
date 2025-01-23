import type { IconifyInfo } from '@iconify/types';
import { TypeGenerator } from './types';

const generateIconTypeDeclaration = (icon: string, preview: string, pack: string, info: IconifyInfo) => `
declare module 'virtual:icons/${pack}/${icon}' {
  export { SvelteComponentDev as default } from 'svelte/internal'
}

declare module '~icons/${pack}/${icon}' {
  import { SvelteComponentTyped } from 'svelte'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Svelte component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  export default class extends SvelteComponentTyped<svelte.JSX.IntrinsicElements['svg']> {}
}
`;

const generateAliasTypeDeclaration = (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => `
declare module 'virtual:icons/${pack}/${icon}' {
  export { SvelteComponentDev as default } from 'svelte/internal'
}

declare module '~icons/${pack}/${icon}' {
  import { SvelteComponentTyped } from 'svelte'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Svelte component.
   * Alias of \`${alias}\` from the same pack.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  export default class extends SvelteComponentTyped<svelte.JSX.IntrinsicElements['svg']> {}
}
`;

export const Svelte3TypeGenerator: TypeGenerator = {
  generateIconTypeDeclaration,
  generateAliasTypeDeclaration,
}
