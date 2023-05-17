import { FC } from 'gyron'
import classnames from 'classnames'

interface ModalProps {
  visible: boolean
}

export const Modal = FC<ModalProps>(({ visible, children }) => {
  return (
    <div
      class={classnames('fixed w-[0px] h-[0px] bg-black/40 -z-10', {
        'w-full h-full z-10': visible,
      })}
    >
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50">
        {children}
      </div>
    </div>
  )
})
