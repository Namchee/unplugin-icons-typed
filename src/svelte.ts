import type { IconifyInfo } from '@iconify/types';
import { TypeGenerator } from './types';

const generateIconTypeDeclaration = (icon: string, preview: string, pack: string, info: IconifyInfo) => `
declare module 'virtual:icons/${pack}/${icon}' {
  import type { Component } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Svelte component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: Component<SvelteHTMLElements['svg']>

  export default component
}

declare module '~icons/${pack}/${icon}' {
  import type { Component } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Svelte component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: Component<SvelteHTMLElements['svg']>

  export default component
}
`;

const generateAliasTypeDeclaration = (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => `
declare module 'virtual:icons/${pack}/${icon}' {
  import type { Component } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'

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
  const component: Component<SvelteHTMLElements['svg']>

  export default component
}

declare module '~icons/${pack}/${icon}' {
  import type { Component } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'

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
  const component: Component<SvelteHTMLElements['svg']>

  export default component
}
`;

export const SvelteTypeGenerator: TypeGenerator = {
  header: '',
  generateIconTypeDeclaration,
  generateAliasTypeDeclaration,
}
