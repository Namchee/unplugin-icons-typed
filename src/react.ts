import type { IconifyInfo } from '@iconify/types';
import { TypeGenerator } from './types';

const generateIconTypeDeclaration = (icon: string, preview: string, pack: string, info: IconifyInfo) => `
declare module 'virtual:icons/${pack}/${icon}' {
  import type { ForwardRefExoticComponent, SVGProps } from 'react'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a React component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  export default component
};

declare module '~icons/${pack}/${icon}' {
  import type { ForwardRefExoticComponent, SVGProps } from 'react'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a React component.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  export default component
}
`;

const generateAliasTypeDeclaration = (icon: string, alias: string, pack: string, info: IconifyInfo, preview?: string) => `
declare module 'virtual:icons/${pack}/${icon}' {
  import type { ForwardRefExoticComponent, SVGProps } from 'react'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a React component.
   * Alias of \`${alias}\` from the same pack.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  export default component
}

declare module '~icons/${pack}/${icon}' {
  import type { ForwardRefExoticComponent, SVGProps } from 'react'

  /**
   * ![preview](data:image/svg+xml;base64,${preview})
   * 
   * \`${icon}\` from ${info.name} pack. Rendered as a React component.
   * Alias of \`${alias}\` from the same pack.
   * 
   * @author ${info.author.name}
   * @license ${info.license.spdx || info.license.title}
   * @see ${info.author.url}
   */
  const component: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  export default component
}
`;

export const ReactTypeGenerator: TypeGenerator = {
  header: '',
  generateIconTypeDeclaration,
  generateAliasTypeDeclaration,
}
