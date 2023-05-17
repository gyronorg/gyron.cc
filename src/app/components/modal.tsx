import { FC } from 'gyron'
import classnames from 'classnames'

interface ModalProps {
  visible: boolean
  onClose?: () => void
}

export const Modal = FC<ModalProps>(({ visible, children, onClose }) => {
  return (
    <div
      class={classnames('fixed w-[0px] h-[0px] bg-black/40 left-0 top-0 z-50 text-gray-800', {
        'w-full h-full': visible,
      })}
      style={{ display: visible ? 'block' : 'none' }}
      onClick={onClose}
    >
      <div
        class={classnames(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-4 w-[500px] rounded-md'
        )}
        onClick={{
          handleEvent: (e) => {
            e.stopPropagation()
          },
        }}
      >
        {children}
      </div>
    </div>
  )
})
