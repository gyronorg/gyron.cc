interface FetchConfig extends RequestInit {
  data?: Record<string, any>
}

async function http(method: 'get' | 'post', url: string, config: FetchConfig) {
  if (method === 'get' && config.data) {
    url += `?${new URLSearchParams(config.data).toString()}`
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
  return await e.json()
}

export function post(url: string, config?: FetchConfig) {
  return http('post', url, config)
}

export function get(url: string, config?: FetchConfig) {
  return http('get', url, config)
}
