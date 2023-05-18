import { join } from 'node:path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { v4 as uuid } from 'uuid'
import type { Code, User } from './scheme'
import type { Source } from '@/components/explorer/wrapper'

interface LowScheme {
  tables: {
    user: User[]
    code: Code[]
  }
}

const file = join(__dirname, 'db.json')

const adapter = new JSONFile<LowScheme>(file)
const defaultData: LowScheme = {
  tables: {
    user: [],
    code: [],
  },
}
const db = new Low(adapter, defaultData)

export function ready() {
  return db.read()
}

export async function registerUser(user: User) {
  await ready()
  const hasUser = db.data.tables.user.find((item) => item.id === user.id)
  if (hasUser) {
    return
  }
  db.data.tables.user.push(user)
  return await db.write()
}

export async function writeSources(
  userId: string,
  sources: Source[],
  name: string,
  sourceId: string = null
) {
  await ready()
  const id = uuid()
  if (sourceId) {
    db.data.tables.code.forEach((item) => {
      if (item.id === sourceId) {
        item.sources = sources
      }
    })
  } else {
    db.data.tables.code.push({
      id,
      name,
      userId,
      sources,
    })
  }
  await db.write()
  return id
}

export async function getAllSources(userId: string) {
  await ready()
  return db.data.tables.code.filter((item) => item.userId === userId)
}
