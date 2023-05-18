import { FC } from 'gyron'
import classnames from 'classnames'

interface ModalProps {
  visible: boolean
  width?: number
  onClose?: () => void
}

export const Modal = FC<ModalProps>(
  ({ visible, width = 500, children, onClose }) => {
    return (
      <div
        class={classnames(
          'fixed w-[0px] h-[0px] bg-black/60 backdrop-blur supports-backdrop-blur:bg-white/95 left-0 top-0 z-50 text-gray-800',
          {
            'w-full h-full': visible,
          }
        )}
        style={{ display: visible ? 'block' : 'none' }}
        onClick={onClose}
      >
        <div
          class={classnames(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-4 rounded-md'
          )}
          style={{ width: width + 'px' }}
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
  }
)
