import { useValue, useWatch, useEffect } from 'gyron'
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

interface Config {
  onReceive: (e: any) => void
}

const rootPeer = useValue<Peer>(null)

const connections = useValue<DataConnection[]>([])

export function p2pCreateRoom(config: Config) {
  return new Promise<{ peer: Peer; id: string }>((resolve) => {
    const peer = initialPeer()
    peer.on('open', (id) => {
      console.log('peer id', id)
      resolve({
        peer,
        id,
      })
    })

    peer.on('connection', (conn) => {
      connections.value.push(conn)
      config && conn.on('data', config.onReceive)
    })

    rootPeer.value = peer
  })
}

export function p2pConnectRoom(id: string, config?: Config) {
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

      config && conn.on('data', config.onReceive)
    })
    peer.on('connection', (conn) => {
      connections.value.push(conn)
    })

    rootPeer.value = peer
  })
}

export function getPeer() {
  return new Promise<Peer>((resolve) => {
    const { effect } = useEffect(() => {
      if (rootPeer.value) {
        resolve(rootPeer.value)
        effect.stop()
      }
    })
  })
}

export function useConnections() {
  return connections
}
