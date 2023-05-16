import { FC, createRef, useValue } from 'gyron'
import { CollaboratorInfo, ExposeInfo } from '@/components/collaborator/info'
import {
  ExposeWrapperEditor,
  Source,
  WrapperEditor,
  normalizedSource,
} from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import {
  clearGithubAccess,
  getGithubAccess,
  GithubAccess,
  setGithubAccess,
} from '@/utils/github'
import { post } from '@/utils/fetch'
import { generateSafeUuid } from '@/utils/uuid'
import { defaultSources } from './explorer'
import classNames from 'classnames'

export const Editor = FC(({ isSSR }) => {
  const token = useValue('')
  const sources = useValue<Source[]>(normalizedSource(defaultSources))
  const namespace = generateSafeUuid()
  const info = createRef<ExposeInfo>()
  const editor = createRef<ExposeWrapperEditor>()

  function initial(code: string, data: any) {
    post('/api/token', {
      data: {
        ...data,
        code,
      },
    })
      .then((data: GithubAccess) => {
        if (data.access_token) {
          setGithubAccess(data)
          token.value = data.access_token
        } else {
          token.value = ''
          clearGithubAccess()
        }
      })
      .catch(() => {})
  }

  try {
    if (!isSSR) {
      if (location.hash) {
        sources.value = JSON.parse(decode(location.hash))
      }
      const access = getGithubAccess()
      const code = new URLSearchParams(location.search).get('code')
      if (access) {
        token.value = access.access_token
      } else if (code) {
        initial(code, {})
      }
    }
  } catch {}

  return (
    <div
      class={classNames('h-[calc(100vh-58px)] flex py-4 gap-3 px-4 md:px-8')}
    >
      <div class="h-full w-[200px]">
        <CollaboratorInfo
          ref={info}
          token={token.value}
          sources={sources.value}
          namespace={namespace}
          onUpdateSources={(e) => {
            editor.current.initial(e)
            sources.value = e
          }}
        />
      </div>
      <div class="flex-1">
        <WrapperEditor
          ref={editor}
          namespace={namespace}
          sources={sources.value}
          event={{
            updateSources(e) {
              info.current?.initial(e)
            },
            removeTab(e) {},
            addTab(e) {},
            changeActiveTab(e1, e2) {
              info.current?.leave(e1)
              info.current?.enter(e2)
            },
          }}
        />
      </div>
    </div>
  )
})
