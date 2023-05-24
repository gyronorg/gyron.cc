import { FC, HTMLInputTypeAttribute, VNode } from 'gyron'
import { Button } from './button'
import { merge } from 'lodash-es'
import { notice } from './notice'

export interface InputProps {
  value: any
  id: string
  type: HTMLInputTypeAttribute
  disabled: boolean
  required: boolean
  placeholder: string
  suffix: VNode
  onSuffixClick: (e: Event) => void
  onChange: (e: InputEvent) => void
}

export const Input = FC<Partial<InputProps>>(
  ({ type, id, value, disabled, required, placeholder, suffix, onChange, onSuffixClick }) => {
    return (
      <div class="relative">
        <input
          type={type || 'text'}
          id={id}
          class="w-full text-zinc-900 enabled:bg-gray-200 enabled:dark:bg-gray-700 dark:text-white placeholder:text-gray-600 px-2 py-1 rounded-sm invalid:border-red-600"
          value={value}
          disabled={disabled || false}
          required={required || false}
          placeholder={placeholder}
          onChange={onChange}
        />
        {suffix && (
          <Button
            disabled={!value}
            className="absolute right-0 top-0 h-full bg-gray-600 enabled:hover:bg-slate-800"
            onClick={onSuffixClick}
            style={merge(
              {
                width: 'auto',
                margin: '0px',
                padding: '6px',
              },
              disabled ? { borderColor: '#545454', color: '#7f7f7f' } : {}
            )}
          >
            {suffix}
          </Button>
        )}
      </div>
    )
  }
)
