import { PeerServer } from 'peer'
import * as core from 'express-serve-static-core'
import http from 'node:http'
import https from 'node:https'

export function createServer(port: number) {
  return new Promise<{
    app: core.Express
    server: http.Server | https.Server
  }>((resolve) => {
    const path = '/api/rtc'
    const peerServer = PeerServer(
      {
        port: port,
        path: path,
        key: 'gyronjs',
      },
      (server) => {
        resolve({
          app: peerServer,
          server,
        })
      }
    )

    peerServer.on('connection', (client) => {
      console.log(
        `client connected: ${client.getId()}. token: ${client.getToken()}`
      )
    })
    peerServer.on('disconnect', (client) => {
      console.log(
        `client disconnected: ${client.getId()}. token: ${client.getToken()}`
      )
    })
    peerServer.on('message', (client, message) => {
      console.log(
        `client id: ${client.getId()}. message: ${JSON.stringify(message)}`
      )
    })
    console.log(`Started PeerServer on ::, port: ${port}, path: ${path}`)
  })
}
