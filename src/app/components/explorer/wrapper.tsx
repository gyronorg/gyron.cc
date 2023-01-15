import { FC, useValue } from 'gyron'
import { Editor } from './editor'
import { Preview } from './preview'
import { Tabs, Tab } from './tab'

export const WrapperEditor = FC(() => {
  const code = useValue('')
  return (
    <Tabs>
      <Tab name="editor" label="编辑">
        <Editor code={code.value} onChange={onChange} />
      </Tab>
      <Tab name="preview" label="预览">
        <Preview code={code.value} />
      </Tab>
    </Tabs>
  )

  function onChange(value: string) {
    code.value = value
  }
})
