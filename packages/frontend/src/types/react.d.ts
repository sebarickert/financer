import 'react';

declare module 'react' {
  interface CSSProperties {
    // Custom css variables
    '--vt-name'?: string;
  }
}
