// use y-webrtc

import ws from 'ws'
import http from 'http'
import * as map from 'lib0/map'

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1

const pingTimeout = 30000

function send(conn: ws.WebSocket, message: object) {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close()
  }
  try {
    conn.send(JSON.stringify(message))
  } catch (e) {
    conn.close()
  }
}

const topics = new Map<string, Set<ws.WebSocket>>()

function toJson() {
  return [...topics.keys()].reduce((prev, curr) => {
    prev[curr] = [...topics.get(curr)]
    return prev
  }, {})
}

export const withEditorRtcServer = (socket: ws.WebSocket) => {
  const subscribedTopics = new Set<string>()
  let closed = false
  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      socket.close()
      clearInterval(pingInterval)
    } else {
      pongReceived = false
      try {
        socket.ping()
      } catch (e) {
        socket.close()
      }
    }
  }, pingTimeout)

  socket.on('pong', () => {
    pongReceived = true
  })

  socket.on('close', () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set()
      subs.delete(socket)
      if (subs.size === 0) {
        topics.delete(topicName)
      }
    })
    subscribedTopics.clear()
    closed = true
  })

  socket.on(
    'message',
    (message: {
      type: string
      topics: string[]
      topic: string
      clients: number
    }) => {
      if (typeof message === 'string') {
        message = JSON.parse(message)
      }
      if (message && message.type && !closed) {
        const _topics = message.topics || []
        switch (message.type) {
          case 'subscribe':
            _topics.forEach((topicName) => {
              if (typeof topicName === 'string') {
                // add conn to topic
                const topic = map.setIfUndefined(
                  topics,
                  topicName,
                  () => new Set()
                )
                topic.add(socket)
                // add topic to conn
                subscribedTopics.add(topicName)
              }
            })
            break
          case 'unsubscribe':
            _topics.forEach((topicName) => {
              const subs = topics.get(topicName)
              if (subs) {
                subs.delete(socket)
              }
            })
            break
          case 'publish':
            if (message.topic) {
              const receivers = topics.get(message.topic)
              if (receivers) {
                message.clients = receivers.size
                receivers.forEach((receiver) => send(receiver, message))
              }
            }
            break
          case 'ping':
            send(socket, { type: 'pong' })
        }

        ;[...topics.keys()].forEach((name) => {
          const sockets = topics.get(name)
          sockets.forEach((socket1) => {
            if (socket1 !== socket) {
              send(socket1, {
                type: 'sync',
                topics: toJson(),
              })
            }
          })
        })
      }
    }
  )
}

export function createEditorSocket(port: number) {
  return new Promise<ws.Server>((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end()
    })
    const wss = new ws.Server({ noServer: true })
    wss.on('connection', withEditorRtcServer)
    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
      })
    })
    server.listen(port, '::', () => {
      console.log(`Started YjsServer on ::, port: ${port}`)
      resolve(wss)
    })
  })
}
