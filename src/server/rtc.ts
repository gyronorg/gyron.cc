import { PeerServer, ExpressPeerServer, PeerServerEvents } from 'peer'
import { ROOM_KEY, ROOM_PATH } from './constant'
import { Express } from 'express'
import http from 'node:http'
import https from 'node:https'
import ws from 'ws'

export function createServer(port: number, server?: http.Server) {
  return new Promise<{
    app: Express & PeerServerEvents
    server: http.Server | https.Server
  }>((resolve) => {
    const path = ROOM_PATH
    const peerServer = PeerServer(
      {
        port: port,
        path: path,
        key: ROOM_KEY,
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
