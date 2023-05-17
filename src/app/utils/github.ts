// App ID: 332870
// Client ID: Iv1.81e27784140f8a43
// client_secret: e1a371d6f05aa9b095874cbaa29acad50a98614b

// 拿 GitHub code https://github.com/login/oauth/authorize?client_id=
// 重定向地址 http://127.0.0.1:3000/?code=9d14199efbb142d7f97c
// 换取 token 由 server 完成, POST https://github.com/login/oauth/access_token
// { client_id, client_secret, code }
// 接口返回 { access_token, scope, token_type }
// 最后就可以请求用户相关的数据
// curl -H "Authorization: Bearer OAUTH-TOKEN" https://api.github.com/user

// 单点登录
// 登陆完成后 token 缓存到本地，获取用户信息。
// 创建协同编辑房间
// 同步数据到 gist, 间隔周期自动保存。以内容 md5 做为标识符，离开时未保存浏览器 block，
// { data: Source[], room: string, username: string, collaborators: string[] }
// 分享其它人，作为协同者。可以登录也可以作为（访客编辑）

//
//

export interface GithubAccess {
  access_token: string
  scope: string
  token_type: string
  refresh_token: string
  // expires_in: 28800
  expires_in: number
  // refresh_token_expires_in: 15897600,
  refresh_token_expires_in: number
  // 登陆时间
  current: number
}

export interface GithubInfo {
  // avatar_url: 'https://avatars.githubusercontent.com/u/26475695?v=4'
  // bio: null
  // blog: ''
  // company: null
  // created_at: '2017-03-17T04:29:55Z'
  // email: 'linkontoask@163.com'
  // events_url: 'https://api.github.com/users/Linkontoask/events{/privacy}'
  // followers: 30
  // followers_url: 'https://api.github.com/users/Linkontoask/followers'
  // following: 7
  // following_url: 'https://api.github.com/users/Linkontoask/following{/other_user}'
  // gists_url: 'https://api.github.com/users/Linkontoask/gists{/gist_id}'
  // gravatar_id: ''
  // hireable: null
  // html_url: 'https://github.com/Linkontoask'
  // id: 26475695
  // location: 'Shang hai'
  // login: 'Linkontoask'
  // name: 'Link'
  // node_id: 'MDQ6VXNlcjI2NDc1Njk1'
  // organizations_url: 'https://api.github.com/users/Linkontoask/orgs'
  // public_gists: 2
  // public_repos: 9
  // received_events_url: 'https://api.github.com/users/Linkontoask/received_events'
  // repos_url: 'https://api.github.com/users/Linkontoask/repos'
  // site_admin: false
  // starred_url: 'https://api.github.com/users/Linkontoask/starred{/owner}{/repo}'
  // subscriptions_url: 'https://api.github.com/users/Linkontoask/subscriptions'
  // twitter_username: null
  // type: 'User'
  // updated_at: '2023-05-07T11:50:06Z'
  // url: 'https://api.github.com/users/Linkontoask'
  avatar_url: string
  created_at: string
  email: string
  events_url: string
  followers: number
  followers_url: string
  following: number
  following_url: string
  gists_url: string
  gravatar_id: string
  hireable: null
  html_url: string
  id: number
  location: string
  login: string
  name: string
  node_id: string
  organizations_url: string
  public_gists: number
  public_repos: number
  received_events_url: string
  repos_url: string
  site_admin: boolean
  starred_url: string
  subscriptions_url: string
  twitter_username: null
  type: 'User'
  updated_at: string
  url: string
}

export interface CreateResponseGist {
  id: string
  html_url: string
  updated_at: string
  created_at: string
  description: string
  files: {
    [key: string]: {
      filename: string
      language: string
      raw_url: string
      size: number
      type: string
    }
  }
}

export function getGithubAccess() {
  const data = localStorage.getItem('access')
  const access = data ? (JSON.parse(data) as GithubAccess) : null
  return access
}

export function setGithubAccess(data: GithubAccess) {
  localStorage.setItem(
    'access',
    JSON.stringify(Object.assign({ current: Date.now() }, data))
  )
}

export function clearGithubAccess() {
  localStorage.removeItem('access')
}

export function getGithubInfo() {
  const data = localStorage.getItem('info')
  const info = data ? (JSON.parse(data) as GithubInfo) : null
  return info
}

export function setGithubInfo(data: GithubInfo) {
  localStorage.setItem('info', JSON.stringify(data))
}
