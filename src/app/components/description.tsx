import { FC } from 'gyron'

interface DescriptionProps {
  desc: string
}

export const DescriptionWithMeta = FC<DescriptionProps>(({ desc }) => {
  return (
    <div class="hidden" id="_description">
      {desc}
    </div>
  )
})
