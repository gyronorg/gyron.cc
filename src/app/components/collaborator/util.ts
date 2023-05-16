import { SignalingConn, WebrtcProvider } from 'y-webrtc'
import { getModal, getEditorWithElement } from '../explorer/hook'
import * as Y from 'yjs'

function waitGetClients(provider: WebrtcProvider) {
  return new Promise<number>((resolve) => {
    const conn: SignalingConn = provider.signalingConns[0]
    console.log(conn)
    conn.send({
      type: 'subscribe',
      topics: [provider.roomName],
      custom: true
    })
    conn.once('message', (e: any) => {
      if (e.type === 'clients-pong') {
        resolve(e.clients)
      }
    })
  })
}

export function send(provider: WebrtcProvider, message: any) {
  const conn: SignalingConn = provider.signalingConns[0]
  conn.send(message)
}

export async function connectMonaco(
  name: string,
  id: string,
  namespace: string,
  collaborate: boolean
) {
  const { model } = await getModal(name, namespace)
  const { instance } = getEditorWithElement(namespace)
  const { MonacoBinding } = await import('y-monaco')
  const ydoc = new Y.Doc()
  const signal = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${
    location.hostname
    // prod url is /api/yjs
    // nginx proxy /api/yjs to 4000 server
  }${process.env.NODE_ENV === 'development' ? ':4000' : '/api/yjs'}`

  const provider = new WebrtcProvider(`${id}_${name}`, ydoc, {
    signaling: [signal],
  })
  const type = ydoc.getText('monaco')

  const clients = collaborate ? await waitGetClients(provider) : 0
  console.log('clients', clients, model.getValue())
  if (clients === 0) {
    type.insert(0, model.getValue())
  } else {
    model.setValue('')
  }

  ydoc.on('update', (update) => {
    if (model.getValue() !== type.toJSON()) {
      model.setValue(type.toJSON())
    }
    Y.applyUpdate(ydoc, update)
  })
  const monacoBinding = new MonacoBinding(
    type,
    model,
    new Set([instance]),
    provider.awareness
  )

  return {
    monacoBinding,
    provider,
  }
}
