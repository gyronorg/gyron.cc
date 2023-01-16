import { FC, useValue } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { Editor, EditorType } from './editor'
import { Preview } from './preview'
import { Tabs, Tab } from './tab'
import { v4 as uuid } from 'uuid'

export interface Source {
  code: string
  name: string
  type: EditorType
  uuid: string
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
      uuid: uuid(),
    },
  ])

  function onActiveChange(uuid: string, name: string) {
    sources.value.forEach((item) => {
      if (item.uuid === uuid) {
        item.name = name
      }
    })
  }

  return (
    <Tabs onInputChange={onActiveChange} onAdd={add}>
      {sources.value.map((item) => (
        <Tab name={item.name} label={item.name} uuid={item.uuid}>
          <Editor
            code={item.code}
            type={item.type}
            onChange={(value) => (item.code = value)}
          />
        </Tab>
      ))}
      <Tab name="preview" label="预览" fixed="right" uuid="preview">
        <Preview source={sources.value} />
      </Tab>
    </Tabs>
  )

  function add(type: EditorType) {
    sources.value.push({
      code: '',
      name: `${sourceName[type]}${_uid++}.${type}`,
      type: type,
      uuid: uuid(),
    })
  }
})
