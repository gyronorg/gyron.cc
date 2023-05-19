import type { Source } from '@/components/explorer/wrapper'
import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { deleteSources, getAllSources, writeSources } from './db'
import logger from './logger'

interface DBServerBody {
  save: {
    type: 'Create' | 'Update'
    sources: Source[]
    name: string
    id?: string
  }
  list: {}
  delete: {
    id: string
  }
}

export const withDBServer: RequestHandler = async (req, res) => {
  const path = req.params['0'] as keyof DBServerBody
  const userId = req.headers['x-user-id'] as string
  try {
    switch (path) {
      case 'delete':
        {
          const { id } = req.body as DBServerBody['delete']
          await deleteSources(id)
          res.send({ code: 0 })
        }
        break
      case 'list':
        res.send(await getAllSources(userId))
        break
      case 'save':
        {
          const { name, sources, id } = req.body as DBServerBody['save']
          const sourceId = await writeSources(userId, sources, name, id)
          res.send({ code: 0, id: sourceId })
        }
        break
      default:
        res.send({ code: 1 })
    }
  } catch (e) {
    logger.error('[Server] ', req.path, e)
    res.send({ code: 2, error: e })
  }
}
