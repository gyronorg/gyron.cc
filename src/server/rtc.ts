import { PeerServer, PeerServerEvents } from 'peer'
import { ROOM_KEY, ROOM_PATH } from './constant'
import { Express } from 'express'
import { omit } from 'lodash-es'
import ws from 'ws'
import http from 'node:http'
import https from 'node:https'

export function createServer(port: number, server?: http.Server) {
  return new Promise<{
    app: Express & PeerServerEvents
    server: http.Server | https.Server
    wsServer: ws.Server<ws.WebSocket>
  }>((resolve) => {
    let wsServer: ws.Server<ws.WebSocket>
    const peerServer = PeerServer(
      {
        port: port,
        path: ROOM_PATH,
        key: ROOM_KEY,
        createWebSocketServer(options) {
          return (wsServer = new ws.Server({
            ...omit(options, 'port', 'server'),
            noServer: true,
          }))
        },
      },
      (server) => {
        resolve({
          app: peerServer,
          server,
          wsServer,
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
  })
}
