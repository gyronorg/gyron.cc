import { DataConnection, Peer } from 'peerjs'
import { ROOM_KEY, ROOM_PATH } from 'src/server/constant'

export function initialPeer() {
  return new Peer(null, {
    host: location.hostname,
    port: Number(location.port),
    path: ROOM_PATH,
    key: ROOM_KEY,
  })
}

export function p2pReady() {
  return new Promise<{ peer: Peer; id: string }>((resolve) => {
    const peer = initialPeer()
    peer.on('open', (id) => {
      console.log('peer id', id)
      resolve({
        peer,
        id,
      })
    })

    peer.on('connection', (e) => {
      console.log('connection to', e)

      e.on('data', (data) => {
        console.log(e.peer, data)
      })
    })
  })
}

interface Config {
  onReceive: (e: any) => void
}

export function p2pConnect(id: string, config: Config) {
  return new Promise<{
    peer: Peer
    conn: DataConnection
  }>((resolve) => {
    const peer = initialPeer()

    peer.on('open', (originId) => {
      const conn = peer.connect(id)
      conn.on('open', () => {
        resolve({
          peer,
          conn,
        })
      })

      conn.on('data', config.onReceive)
    })
  })
}
