import { FC, useReactive, useValue } from 'gyron'
import { Explorer } from './explorer'
import { CollaboratorInfo } from '@/components/collaborator/info'
import { CollaboratorList } from '@/components/collaborator/list'
import { Source } from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import {
  clearGithubAccess,
  getGithubAccess,
  GithubAccess,
  setGithubAccess,
} from '@/utils/github'
import { post } from '@/utils/fetch'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { generateSafeUuid } from '@/utils/uuid'

export const Editor = FC(({ isSSR }) => {
  const token = useValue('')
  const sources = useValue<Source[]>([])
  const namespace = generateSafeUuid()

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
        <CollaboratorInfo token={token.value} sources={sources.value} namespace={namespace} />
        <CollaboratorList />
      </div>
      <div class="flex-1">
        <Explorer
          namespace={namespace}
          sources={sources.value}
          hasPadding={false}
          onUpdateSources={(e) => (sources.value = e)}
        />
      </div>
    </div>
  )
})
