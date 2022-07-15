import { FC } from '@gyron/runtime'

export const Skeleton = FC<{
  length: number
}>(({ length }) => {
  return (
    <>
      {Array.from({ length: length })
        .fill(true)
        .map(() => (
          <div class="skeleton mb-12">
            <div class="w-1/3 h-4 rounded dark:bg-[#515151] bg-[#bdbdbd] opacity-30"></div>
            <ul class="mt-6 p-0 space-y-5">
              <li class="h-4 rounded dark:bg-[#515151] bg-[#bdbdbd] opacity-30 list-none"></li>
              <li class="h-4 rounded dark:bg-[#515151] bg-[#bdbdbd] opacity-30 list-none"></li>
              <li class="w-3/5 h-4 rounded dark:bg-[#515151] bg-[#bdbdbd] opacity-30 list-none"></li>
            </ul>
          </div>
        ))}
    </>
  )
})
