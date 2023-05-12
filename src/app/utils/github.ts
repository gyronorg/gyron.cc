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
}
