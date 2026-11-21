// The types of the files that the webpack config in next.config.js loads.
// The type check (tsconfig.typecheck.json) reads this file.

// @svgr/webpack turns an SVG file into a React component.
declare module '*.svg' {
  import type { FC, SVGProps } from 'react';

  const Component: FC<SVGProps<SVGSVGElement>>;
  export default Component;
}

// url-loader turns an image file into its URL.
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

// A style sheet import only adds the styles.
declare module '*.css';
