import { generateSafeUuid } from '@/utils/uuid'
import { createRef, FC, useValue } from 'gyron'
import { Editor, EditorType } from './editor'
import { Preview, PreviewExpose } from './preview'
import { Tabs, Tab } from './tab'

export interface Source {
  code: string
  name: string
  type: EditorType
  uuid: string
}

let _uid = 1
const sourceName: Record<EditorType, string> = {
  typescript: 'Comp',
  css: 'Style',
}
const sourceSuffixName: Record<EditorType, string> = {
  typescript: '.jsx',
  css: '.css',
}

export const WrapperEditor = FC(() => {
  const namespace = generateSafeUuid()

  const preview = createRef<PreviewExpose>()
  const sources = useValue<Source[]>([
    {
      name: 'Comp.jsx',
      type: 'typescript',
      code: '',
      uuid: generateSafeUuid(),
    },
  ])

  function onActiveChange(uuid: string, name: string) {
    sources.value.forEach((item) => {
      if (item.uuid === uuid) {
        item.name = name
      }
    })
  }

  function onRun() {
    if (preview && preview.current) {
      preview.current.start()
    }
  }

  return (
    <Tabs
      onInputChange={onActiveChange}
      onAdd={add}
      onRemove={onRemove}
      onRun={onRun}
    >
      {sources.value.map((item) => (
        <Tab name={item.name} label={item.name} uuid={item.uuid}>
          <Editor
            key={item.uuid}
            code={item.code}
            type={item.type}
            onChange={(value) => (item.code = value)}
          />
        </Tab>
      ))}
      <Tab name="preview" label="预览" fixed="right" uuid="preview">
        <Preview source={sources.value} namespace={namespace} ref={preview} />
      </Tab>
    </Tabs>
  )

  function add(type: EditorType) {
    const source = {
      code: '',
      name: `${sourceName[type]}${_uid++}${sourceSuffixName[type]}`,
      type: type,
      uuid: generateSafeUuid(),
    }
    sources.value.push(source)
    return source
  }

  function onRemove(uuid: string) {
    const index = sources.value.findIndex((source) => source.uuid === uuid)
    const nextIndex = index === 0 ? 1 : index - 1
    const nextUuid = sources.value[nextIndex]?.uuid
    sources.value.splice(index, 1)
    return nextUuid
  }
})
