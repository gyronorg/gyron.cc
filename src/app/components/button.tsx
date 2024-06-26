import classNames from 'classnames'
import { CSSProperties, FC } from 'gyron'

export interface ButtonProps {
  type: 'text' | 'primary'
  disabled: boolean
  style: CSSProperties
  className: string
  onClick: (e: Event) => void
}

export const Button = FC<Partial<ButtonProps>>(
  ({
    type = 'primary',
    disabled,
    children,
    className,
    style = {},
    onClick,
  }) => {
    return (
      <button
        class={classNames(
          'block my-2 enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:cursor-pointer',
          {
            'text-white px-4 py-1 border rounded-sm border-sky-100 disabled:border-stone-700 disabled:text-stone-500 enabled:hover:bg-black/20 w-full':
              type === 'primary',
            'text-gray-400 enabled:text-primary-500 enabled:hover:text-primary-300':
              type === 'text',
          },
          className
        )}
        disabled={disabled || false}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    )
  }
)
