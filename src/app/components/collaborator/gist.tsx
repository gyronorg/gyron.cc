import { get, patch, post } from '@/utils/fetch'
import { CreateResponseGist } from '@/utils/github'
import { Source } from '../explorer/wrapper'

export async function createGist(name: string, sources: Source[]) {
  return await post<CreateResponseGist>('/api/github/gists', {
    data: {
      description: 'Gyron.js Editor Code Workspace',
      public: true,
      files: {
        [name]: {
          content: JSON.stringify(sources),
        },
      },
    },
  })
}

async function getGistList() {
  return await get('/api/github/gists/public')
}

export async function patchGist(id: string, name: string, sources: Source[]) {
  return await patch(`/api/github/gists/${id}`, {
    data: {
      files: {
        [name]: {
          content: JSON.stringify(sources)
        }
      }
    }
  })
}
