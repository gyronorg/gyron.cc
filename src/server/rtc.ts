import { PeerServerEvents } from 'peer'
import { Peer } from './peer'
import { ROOM_KEY, ROOM_PATH } from './constant'
import { Express } from 'express'
import { omit } from 'lodash-es'
import ws from 'ws'

export function createServer(
  port: number,
  server: any,
  app: Express & PeerServerEvents
) {
  let wsServer: ws.Server<ws.WebSocket>
  const peerServer = Peer(server, {
    port: port,
    path: ROOM_PATH,
    key: ROOM_KEY,
    createWebSocketServer(options) {
      return (wsServer = new ws.Server({
        ...omit(options, 'port', 'server'),
        noServer: true,
      }))
    },
  })

  app.on('connection', (client) => {
    console.log(
      `client connected: ${client.getId()}. token: ${client.getToken()}`
    )
  })
  app.on('disconnect', (client) => {
    console.log(
      `client disconnected: ${client.getId()}. token: ${client.getToken()}`
    )
  })
  app.on('message', (client, message) => {
    console.log(
      `client id: ${client.getId()}. message: ${JSON.stringify(message)}`
    )
  })
  app.use(peerServer)

  return {
    app,
    wsServer,
  }
}
