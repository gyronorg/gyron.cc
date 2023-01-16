import { FC, useValue } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { Editor, EditorType } from './editor'
import { Preview } from './preview'
import { Tabs, Tab } from './tab'

interface Source {
  code: string
  name: string
  type: EditorType
}

let _uid = 1
const sourceName: Record<EditorType, string> = {
  jsx: 'Comp',
  css: 'Style',
}

export const WrapperEditor = FC(() => {
  const code = useValue('')
  const sources = useValue<Source[]>([
    {
      name: 'Comp.jsx',
      type: 'jsx',
      code: '',
    },
  ])

  return (
    <Tabs>
      {sources.value.map((item) => (
        <Tab
          name={item.name}
          label={item.name}
          onInputChange={(value) => (item.name = value)}
        >
          <Editor
            code={item.code}
            type={item.type}
            onChange={(value) => (item.code = value)}
          />
        </Tab>
      ))}
      <Tab name="editor" label="添加">
        <Dropdown onClick={add}>
          <DropdownItem name="jsx">JSX</DropdownItem>
          <DropdownItem name="css">CSS</DropdownItem>
        </Dropdown>
      </Tab>
      <Tab name="preview" label="预览" fixed="right">
        <Preview code={code.value} />
      </Tab>
    </Tabs>
  )

  function add(type: EditorType) {
    sources.value.push({
      code: '',
      name: `${sourceName[type]}${_uid++}.${type}`,
      type: type,
    })
  }
})
