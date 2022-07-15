declare module '*.html' {
  const A = ''
  export default A
}
declare module '*.mdx' {
  let MDXComponent: (props: any) => any
  export default MDXComponent
}
declare const __TMP__: string
declare const __CLIENT__: {
  css: string
  js: string
}
declare module '@docsearch/js' {
  import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react'
  interface DocSearchProps extends DocSearchComponentProps {
    container: HTMLElement | string
    environment?: typeof window
  }
  export default function docsearch(props: DocSearchProps): void
}
