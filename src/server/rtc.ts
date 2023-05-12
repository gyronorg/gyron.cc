import { PeerServer } from 'peer'

export function createServer(port: number) {
  const peerServer = PeerServer({
    port: port,
    path: '/api/rtc',
    key: 'gyronjs',
  })

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
  console.log(
    `Started PeerServer on ::, port: ${port}, path: ${peerServer.path()}`
  )

  return peerServer
}
