import { FC, HTMLInputTypeAttribute } from 'gyron'

export interface InputProps {
  value: any
  id: string
  type: HTMLInputTypeAttribute
  disabled: boolean
  required: boolean
  placeholder: string
  onChange: (e: InputEvent) => void
}

export const Input = FC<Partial<InputProps>>(
  ({ type, id, value, disabled, required, placeholder, onChange }) => {
    return (
      <input
        type={type || 'text'}
        id={id}
        class="w-full text-zinc-900 dark:text-white placeholder:text-gray-600 px-2 py-1 rounded-sm invalid:border-red-600"
        value={value}
        disabled={disabled || false}
        required={required || false}
        placeholder={placeholder}
        onChange={onChange}
      />
    )
  }
)
