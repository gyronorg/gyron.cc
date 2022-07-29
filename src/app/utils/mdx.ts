import { NavigationBar } from '@/components/guidance'
import { VNode, FCA } from 'gyron'

export async function invokeWithGetMdxAnchor(
  mdx: () => Promise<typeof import('*.mdx')>
): Promise<NavigationBar[]> {
  const content = (await mdx()) as unknown as { default: (a: any) => any }
  const anchor = (content.default({}).children as VNode[])
    .map((item) => {
      if (['h2', 'h3'].includes(item?.tag)) {
        return {
          type: item.tag as 'h2' | 'h3',
          name: item.children[0],
        }
      }
    })
    .filter(Boolean)
  return anchor
}

export function wrapAsyncMdxContent(mdx: any) {
  return FCA(mdx)
}
