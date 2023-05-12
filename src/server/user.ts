import { RequestHandler } from 'express'
import { APP_ID, CLIENT_ID, CLIENT_SECRET } from './constant'
import fetch from 'node-fetch'

export const withToken: RequestHandler = async (req, res, next) => {
  const j = await fetch('https://github.com/login/oauth/access_token', {
    headers: {
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: req.body.code,
    }),
  })
  const data = (await j.json()) as { access_token: string }
  res.cookie('token', data.access_token, { httpOnly: true })
  res.send(data)
}

export const withGithub: RequestHandler = async (req, res) => {
  const url = req.path.replace(/^\/?api\/github\/?/, '')
  const j = await fetch(`https://github.com/${url}`, {
    method: req.method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${req.cookies.token}`,
    },
    body: JSON.stringify(req.body),
  })
  const data = await j.json()
  res.send(data)
}
