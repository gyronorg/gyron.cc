import { FC, useReactive, useValue } from 'gyron'
import { Explorer } from './explorer'
import { CollaboratorInfo } from '@/components/collaborator/info'
import { CollaboratorList } from '@/components/collaborator/list'
import { Source } from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import { GithubAccess } from '@/utils/github'
import { post } from '@/utils/fetch'
import classNames from 'classnames'

export const Editor = FC(() => {
  const access = useReactive<GithubAccess>({
    access_token: '',
    scope: '',
    token_type: '',
  })
  let sources: Source[] = []

  try {
    if (location.hash) {
      sources = JSON.parse(decode(location.hash))
    }
    if (location.search) {
      const code = new URLSearchParams(location.search).get('code')
      post('/api/token', {
        data: { code },
      }).then((data: GithubAccess) => {
        access.access_token = data.access_token
        access.scope = data.scope
        access.token_type = data.token_type
      })
    }
  } catch {}

  return (
    <div class={classNames('h-[calc(100vh-58px)] flex')}>
      <div class="h-full w-[200px]">
        <CollaboratorInfo access={access} />
        <CollaboratorList />
      </div>
      <div class="flex-1">
        <Explorer sources={sources} />
      </div>
    </div>
  )
})
