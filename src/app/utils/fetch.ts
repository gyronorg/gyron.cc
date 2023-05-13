interface FetchConfig extends RequestInit {
  data?: Record<string, any>
}

async function http<T>(method: 'get' | 'post', url: string, config: FetchConfig): Promise<T> {
  if (method === 'get') {
    if (config && config.data) {
      url += `?${new URLSearchParams(config.data).toString()}`
    }
  } else {
    config.body = JSON.stringify(config.data)
  }
  const e = await fetch(
    url,
    Object.assign(
      {
        headers: {
          'content-type': 'application/json',
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
