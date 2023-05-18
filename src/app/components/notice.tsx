import { FC, VNodeChildren, createGyron } from 'gyron'

interface NoticeProps {
  top?: number
}

const Notice = FC<NoticeProps>(({ children, top = 50 }) => {
  return (
    <div
      class="fixed left-1/2 -translate-x-1/2 rounded-sm px-4 py-2 bg-slate-700 text-white dark:bg-slate-50 dark:text-slate-700 z-50 text-sm message"
      style={{ top: top + 'px' }}
      data-top={top}
    >
      {children}
    </div>
  )
})

let _queue: HTMLDivElement[] = []

export function notice(content: VNodeChildren, ms?: number) {
  const container = document.createElement('div')

  const gyron = createGyron(
    <Notice top={(_queue.length + 1) * 50}>{content}</Notice>
  ).render(container)

  _queue.push(container.querySelector('div'))

  document.body.append(container)
  function close() {
    const m = container.querySelector('div')
    const index = _queue.findIndex((item) => item === m)
    _queue.slice(index).forEach((item) => {
      const top = +item.dataset['top'] - 50
      item.style.top = top + 'px'
      item.setAttribute('data-top', '' + top)
    })
    _queue.splice(index, 1)
    m.classList.add('message-out')
    m.addEventListener('transitionend', () => {
      gyron.destroy()
      container.remove()
    })
  }
  setTimeout(close, ms || 5000)
  return close
}
