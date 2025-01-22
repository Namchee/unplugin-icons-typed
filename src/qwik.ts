import type { IconifyInfo } from '@iconify/types';
import { TypeGenerator } from './types';

const generateIconTypeDeclaration = (icon: string, preview: string, pack: string, info: IconifyInfo) => `
declare module 'virtual:icons/${pack}/${icon}' {
  import type { FunctionComponent, QwikIntrinsicElements } from '@builder.io/qwik'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Qwik component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const Component: FunctionComponent<QwikIntrinsicElements['svg']>
  export default Component
}

declare module '~icons/${pack}/${icon}' {
  import type { FunctionComponent, QwikIntrinsicElements } from '@builder.io/qwik'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Qwik component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const Component: FunctionComponent<QwikIntrinsicElements['svg']>
  export default Component
}
`;

const generateAliasTypeDeclaration = (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => `
declare module 'virtual:icons/${pack}/${icon}' {
  import type { FunctionComponent, QwikIntrinsicElements } from '@builder.io/qwik'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Qwik component.
   * Alias of \`${alias}\` from the same pack.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const Component: FunctionComponent<QwikIntrinsicElements['svg']>
  export default Component
}

declare module '~icons/${pack}/${icon}' {
  import type { FunctionComponent, QwikIntrinsicElements } from '@builder.io/qwik'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a Qwik component.
   * Alias of \`${alias}\` from the same pack.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const Component: FunctionComponent<QwikIntrinsicElements['svg']>
  export default Component
}
`;

export const QwikTypeGenerator: TypeGenerator = {
  header: '',
  generateIconTypeDeclaration,
  generateAliasTypeDeclaration,
}
