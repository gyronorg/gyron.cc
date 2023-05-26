// use y-webrtc

import ws from 'ws'
import http from 'http'
import * as map from 'lib0/map'
import type { Source } from '@/components/explorer/wrapper'

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
const workspaces = new Map<string, Source[]>()

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

  function notice(message: any) {
    const receivers = topics.get(message.topic)
    if (receivers) {
      message.clients = receivers.size
      receivers.forEach((receiver) => send(receiver, message))
    }
  }

  socket.on(
    'message',
    (message: {
      type: string
      topics: string[]
      topic: string
      clients: number
      sources?: Source[]
    }) => {
      if (typeof message === 'string') {
        message = JSON.parse(message)
      }
      if (message && message.type && !closed) {
        const _topics = message.topics || []
        switch (message.type) {
          case 'leave':
            const receivers = topics.get(message.topic)
            // size 为 1 或者 0 代表只有自己一个客户端在这个房间里了
            if (receivers && (receivers.size === 1 || receivers.size === 0)) {
              workspaces.set(message.topic, message.sources)
            }
            break
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
                // 告诉客户端当前房间有多少人
                message.topic = topicName
                message.type = 'clients-pong'
                notice(message)
              }
            })
            const topic = _topics[0]
            if (topic) {
              const receivers = topics.get(topic)
              if (receivers && receivers.size === 1) {
                const sources = workspaces.get(topic)
                if (sources && sources.length) {
                  message.type = 'sync-sources'
                  message.topic = topic
                  message.sources = sources
                  notice(message)
                }
              }
            }
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
      }
    }
  )
}

export function createEditorSocket() {
  return new Promise<ws.Server>((resolve) => {
    const wss = new ws.Server({ noServer: true })
    wss.on('connection', withEditorRtcServer)
    resolve(wss)
  })
}
