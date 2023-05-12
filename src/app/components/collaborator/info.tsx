import { GithubAccess } from '@/utils/github'
import { FC, useWatch } from 'gyron'
import { GithubIcon } from '../icons'
import { get } from '@/utils/fetch'
import { CLIENT_ID } from 'src/server/constant'

interface CollaboratorInfoProps {
  access: GithubAccess
}

export const CollaboratorInfo = FC<CollaboratorInfoProps>(({ access }) => {
  useWatch(() => {
    if (access.access_token) {
      get('/api/github/user').then((info) => {
        console.log(info)
      })
    }
  })

  function onOAuth() {
    location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
  }

  return (
    <div>
      {access.access_token ? (
        <div>
          <img src="" alt="头像" />
          <div>用户名</div>
        </div>
      ) : (
        <button onClick={onOAuth}>
          <GithubIcon />
        </button>
      )}
    </div>
  )
})
