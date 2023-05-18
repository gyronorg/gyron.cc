import { RequestHandler } from 'express'
import { CLIENT_ID, CLIENT_SECRET } from './constant'
import { GithubAccess } from '@/utils/github'
import { registerUser } from './db'
import fetch from 'node-fetch'
import logger from './logger'

export const withToken: RequestHandler = async (req, res, next) => {
  const r = {
    ...req.body,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }
  const j = await fetch('https://github.com/login/oauth/access_token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(r),
  })
  const data = (await j.json()) as GithubAccess
  if (data.access_token) {
    res.cookie('token', data.access_token)
    logger.info('[OAuth Token]', data.access_token)
  }
  res.send(data)
}

export const withGithub: RequestHandler = async (req, res) => {
  const r =
    req.method.toLocaleLowerCase() === 'post' ? JSON.stringify(req.body) : null
  const j = await fetch(`https://api.github.com/${req.params['0']}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${req.cookies.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: r,
  })
  const data: any = await j.json()
  if (
    req.params['0'] === 'user' &&
    req.method.toLocaleLowerCase() === 'get' &&
    data &&
    data.type === 'User'
  ) {
    await registerUser(data)
  }
  logger.info(
    '[Github Api]',
    ' url: ',
    req.originalUrl,
    ' request body: ',
    r,
    ' response body: ',
    JSON.stringify(data)
  )
  res.send(data)
}
