import type { Source } from '@/components/explorer/wrapper'

export interface User {
  id: string
  name: string
  email: string
  url: string
  followers: number
  following: number
}

export interface Code {
  name: string
  userId: string
  id: string
  sources: Source[]
}
