import { FC, VNodeChildren, createGyron } from 'gyron'
import { Modal } from './modal'
import { Button } from './button'

interface ConfirmProps {
  onCancel: () => void
  onConfirm: () => void
}

const Confirm = FC<ConfirmProps>(({ onCancel, onConfirm, children }) => {
  return (
    <Modal width={400} visible>
      <div class="py-2">{children}</div>
      <div class="flex items-center border-t border-gray-400 py-1 mt-2 gap-4">
        <Button type="text" style={{ marginLeft: 'auto' }} onClick={onCancel}>
          取消
        </Button>
        <Button type="text" onClick={onConfirm}>
          确认
        </Button>
      </div>
    </Modal>
  )
})

export function confirm(content: VNodeChildren) {
  return new Promise<void>((resolve, reject) => {
    const container = document.createElement('div')
    const gyron = createGyron(
      <Confirm
        onCancel={() => {
          gyron.destroy()
          container.remove()
          reject()
        }}
        onConfirm={() => {
          gyron.destroy()
          container.remove()
          resolve()
        }}
      >
        {content}
      </Confirm>
    ).render(container)
    document.body.append(container)
  })
}
