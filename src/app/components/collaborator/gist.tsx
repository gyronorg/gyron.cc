import { post } from '@/utils/fetch'
import { CreateResponseGist } from '@/utils/github'
import { Source } from '../explorer/wrapper'

export async function createGist(sources: Source[], name: string) {
  return await post<CreateResponseGist>('/api/editor/save', {
    data: {
      type: 'Create',
      sources: sources,
      name: name
    },
  })
}

export async function getGistList() {
  return await post<CreateResponseGist[]>('/api/editor/list')
}

export async function patchGist(id: string, sources: Source[]) {
  return await post(`/api/editor/save`, {
    data: {
      type: 'Update',
      id: id,
      sources: sources,
    },
  })
}
