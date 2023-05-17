import { FC, VNodeChildren, createGyron } from 'gyron'

const Notice = FC(({ children }) => {
  return (
    <div class="absolute right-0 top-0 border border-gray-400 rounded-md p-4 bg-slate-700 text-white dark:bg-slate-50 dark:text-slate-700">
      {children}
    </div>
  )
})

export function notice(content: VNodeChildren, ms?: number) {
  const container = document.createElement('div')
  const gyron = createGyron(<Notice>{content}</Notice>).render(container)
  document.body.append(container)
  function close() {
    gyron.destroy()
    container.remove()
  }
  setTimeout(close, ms || 5000)
  return close
}
