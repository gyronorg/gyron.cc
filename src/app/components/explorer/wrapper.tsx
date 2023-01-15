import { FC, useValue } from 'gyron'
import { Editor } from './editor'
import { Preview } from './preview'

export const WrapperEditor = FC(() => {
  const code = useValue('')
  return (
    <div>
      <Editor code={code.value} onChange={onChange} />
      <Preview code={code.value} />
    </div>
  )

  function onChange(value: string) {
    code.value = value
  }
})
