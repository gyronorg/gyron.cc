import { Peer } from 'peerjs'
import { merge } from 'lodash-es'
import { ROOM_KEY, ROOM_PATH } from 'src/server/constant'

export function initialPeer() {
  return new Peer(
    null,
    merge(
      {
        host: location.hostname,
        path: ROOM_PATH,
        key: ROOM_KEY,
      },
      location.port ? { port: Number(location.port) } : {}
    )
  )
}

export function readyPeer(close: () => void) {
  return new Promise<{ peer: Peer; id: string }>((resolve) => {
    const peer = initialPeer()
    peer.on('open', (id) => {
      console.log('peer id', id)
      resolve({
        peer,
        id,
      })
    })
    peer.on('close', close)
  })
}
