import { generateSafeUuid } from '@/utils/uuid'
import { createRef, FC, useValue } from 'gyron'
import { Explorer } from './constant'
import { Editor, EditorType } from './editor'
import { Preview, PreviewExpose, TransformInValidate } from './preview'
import { Tabs, Tab } from './tab'

export interface Source {
  code: string
  name: string
  type: EditorType
  uuid: string
}

export interface CompilerError {
  name: string
  loc: {
    start: {
      line: number
      column: number
    }
    end: {
      line: number
      column: number
    }
  }
  message: string
}

let _uid = 1
const sourceName: Record<EditorType, string> = {
  typescript: 'Comp',
  css: 'Style',
}
const sourceSuffixName: Record<EditorType, string> = {
  typescript: '.tsx',
  css: '.css',
}

export const WrapperEditor = FC(() => {
  const namespace = generateSafeUuid()

  const preview = createRef<PreviewExpose>()
  const sources = useValue<Source[]>([
    {
      name: 'Comp.tsx',
      type: 'typescript',
      code: '',
      uuid: generateSafeUuid(),
    },
  ])
  const compilerTsxError = useValue<CompilerError[]>([])

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
      namespace={namespace}
      onInputChange={onActiveChange}
      onAdd={add}
      onRemove={onRemove}
      onRun={onRun}
    >
      {sources.value.map((item) => (
        <Tab name={item.name} label={item.name} uuid={item.uuid}>
          <Editor
            name={item.name}
            key={item.uuid}
            code={item.code}
            type={item.type}
            onChange={(value) => (item.code = value)}
            compilerTsxError={compilerTsxError}
          />
        </Tab>
      ))}
      <Tab
        name={Explorer.Preview}
        label="预览"
        fixed="right"
        uuid={Explorer.Preview}
      >
        <Preview
          source={sources.value}
          namespace={namespace}
          ref={preview}
          onTransformInValidate={onTransformInValidate}
        />
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

  function onTransformInValidate(ret: Parameters<TransformInValidate>[0]) {
    compilerTsxError.value.push({
      name: ret.name,
      loc: ret.path.node.loc,
      message: `File "${ret.name}" is not defined in the local editor, but "${ret.name}" is found imported in the "${ret.parent}" module`,
    })
  }
})
