import { getGithubInfo } from './github'

interface FetchConfig extends RequestInit {
  data?: Record<string, any>
}

async function http<T>(
  method: 'get' | 'post' | 'patch',
  url: string,
  config: FetchConfig
): Promise<T> {
  if (method === 'get') {
    if (config?.data) {
      url += `?${new URLSearchParams(config.data).toString()}`
    }
  } else if (config?.data) {
    config.body = JSON.stringify(config.data)
  }
  const e = await fetch(
    url,
    Object.assign(
      {
        headers: {
          'content-type': 'application/json',
          'x-user-id': getGithubInfo()?.id,
        },
        method,
      },
      config
    )
  )
  return await e.json().catch((reason) => {
    console.log(reason)
  })
}

export function post<T = any>(url: string, config?: FetchConfig) {
  return http<T>('post', url, config)
}

export function get<T = any>(url: string, config?: FetchConfig) {
  return http<T>('get', url, config)
}

export function patch<T = any>(url: string, config?: FetchConfig) {
  return http<T>('patch', url, config)
}
