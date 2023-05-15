import { FC } from 'gyron'

export interface ButtonProps {
  disabled: boolean
  onClick: (e: Event) => void
}

export const Button = FC<Partial<ButtonProps>>(({ disabled, children, onClick }) => {
  return (
    <button
      class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2 disabled:border-stone-700 disabled:text-stone-500 enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:hover:bg-black/20 w-full"
      disabled={disabled || false}
      onClick={onClick}
    >
      {children}
    </button>
  )
})
