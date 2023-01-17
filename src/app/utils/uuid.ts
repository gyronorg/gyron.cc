import { v4 as uuid } from 'uuid'

export function generateSafeUuid() {
  return uuid().replace(/-/g, '')
}
