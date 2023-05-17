import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
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

const __dirname = dirname(fileURLToPath(import.meta.url))
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

export async function writeSources(id: string, sources: Source[]) {
  await ready()
  db.data.tables.code.push({
    id: uuid(),
    userId: id,
    sources,
  })
  return await db.write()
}
