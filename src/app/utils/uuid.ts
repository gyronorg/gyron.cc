import { v4 as uuid } from 'uuid'

export function generateSafeUuid(prefix?: string) {
  return (
    (prefix || '') +
    uuid()
      .replace(/-/g, '')
      .replace(/^[0-9]+/, '')
  )
}
