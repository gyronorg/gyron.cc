import { FC, VNode, h } from 'gyron'

export interface FormItemProps {
  name: string
}

export const FormItem = FC<Partial<FormItemProps>>(({ name, children }) => {
  return (
    <div>
      <label for={name} class="mb-2 mt-3 block">
        {name}
      </label>
      {h(children as VNode, { id: name })}
    </div>
  )
})
