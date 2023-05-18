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

export function readyPeer() {
  return new Promise<{ peer: Peer; id: string }>((resolve) => {
    const peer = initialPeer()
    peer.on('open', (id) => {
      console.log('peer id', id)
      resolve({
        peer,
        id,
      })
    })
  })
}
