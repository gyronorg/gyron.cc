import { createRef, FC, onAfterMount } from 'gyron'

interface PreviewProps {
  code: string
}

export const Preview = FC<PreviewProps>(({ code }) => {
  const container = createRef<HTMLDivElement>()
  return <div class="h-[400px]">{code}</div>
})
