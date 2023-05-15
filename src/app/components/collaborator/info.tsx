import {
  createRef,
  exposeComponent,
  FC,
  onAfterUpdate,
  useReactive,
  useValue,
  h,
  createInstance,
} from 'gyron'
import { GithubIcon } from '../icons'
import { get } from '@/utils/fetch'
import { CLIENT_ID } from 'src/server/constant'
import { GithubInfo, setGithubInfo } from '@/utils/github'
import { createGist } from './gist'
import { p2pConnectRoom, p2pCreateRoom } from './p2p'
import { Source } from '../explorer/wrapper'
import { getModal } from '../explorer/hook'
import Peer, { DataConnection } from 'peerjs'
import { connectMonaco } from './util'
import type { MonacoBinding } from 'y-monaco'
import type { WebrtcProvider, SignalingConn } from 'y-webrtc'
import { Button } from '../button'
import { Input } from '../input'
import { FormItem } from '../formItem'
import { Collaborator } from './list'
import { isArray } from 'lodash-es'

interface CollaboratorInfoProps {
  token: string
  namespace: string
  sources: Source[]
  onUpdateSources?: (e: Source[]) => void
}

export interface ExposeInfo {
  leave: (id: string) => void
  enter: (id: string) => void
}

function useGithubInfo(token: string) {
  const info = useValue<Partial<GithubInfo>>({})
  function getInfo() {
    get('/api/github/user').then((data: GithubInfo) => {
      if (data.name) {
        info.value = data
        setGithubInfo(data)
      } else {
        //
      }
    })
  }
  if (!info.value.name) {
    if (token) {
      getInfo()
    } else {
      onAfterUpdate((b: CollaboratorInfoProps, a: CollaboratorInfoProps) => {
        if (b.token !== a.token) {
          b.token = a.token
          getInfo()
        }
      })
    }
  }
  return info
}

function renderStreamWithCanvas(
  stream: MediaStream,
  container: HTMLDivElement,
  id: string
) {
  const li = document.createElement('li')
  createInstance(<Collaborator id={id} stream={stream} />).render(li)
  container.append(li)
}

function removeStreamWithCanvas(container: HTMLDivElement, id: string) {
  const li = container.querySelector(`#collaborator_${id}`)
  li?.remove()
}

async function onCall(
  audio: boolean,
  video: boolean,
  peer: Peer,
  container: HTMLDivElement
) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: audio,
    video: video,
  })
  peer.on('call', async (call) => {
    call.answer(stream)
    call.on('stream', (stream) => {
      renderStreamWithCanvas(stream, container, call.connectionId)
    })
    call.on('close', () => {
      removeStreamWithCanvas(container, call.connectionId)
    })
  })
  return stream
}

async function call(
  peer: Peer,
  roomId: string,
  stream: MediaStream,
  container: HTMLDivElement
) {
  const call = peer.call(roomId, stream)

  call.on('stream', (stream) => {
    renderStreamWithCanvas(stream, container, call.connectionId)
  })
  call.on('close', () => {
    removeStreamWithCanvas(container, call.connectionId)
  })
  return call
}

function createEditorHook() {
  return {
    getSources: (conn: DataConnection) => {
      return new Promise<Source[]>((resolve) => {
        console.log(conn)
        conn.on('data', (e: any) => {
          console.log('data', e)
          if (e.type === 'initial-sources') {
            resolve(e.data)
          }
        })
      })
    },
  }
}

function onOAuth() {
  location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user,gist,public_repo`
}

export const CollaboratorInfo = FC<CollaboratorInfoProps>(
  ({ token, sources, namespace, onUpdateSources, isSSR }) => {
    const share = useValue('')
    const roomName = useValue('')
    const sourceRoomId = useValue('')
    const targetRoomId = useValue(
      isSSR ? '' : new URLSearchParams(location.search).get('room_id')
    )
    const config = useReactive({
      audio: false,
      video: true,
      disabledCreateRoom: false,
      disabledJoinRoom: false,
    })
    const info = useGithubInfo(token)
    const canvasContainer = createRef<HTMLDivElement>()
    const connectMonacoInstance = createRef<WebrtcProvider>()
    const { getSources } = createEditorHook()
    const pool: Record<string, number> = {}

    function onOpenGist() {}

    function onMessageWithMonaco(provider: WebrtcProvider) {
      const conn1: SignalingConn = provider.signalingConns[0]
      conn1.on(
        'message',
        (m: {
          clients: number
          type: string
          topic: string
          topics: string[]
        }) => {
          if (m.type === 'subscribe') {
            console.log('subscribe', m)
            if (isArray(m.topics) && m.topics.length) {
              pool[m.topics[0]] = m.clients
            }
          }
          if (m.type === 'unsubscribe') {
            console.log('unsubscribe', m)
            if (isArray(m.topics) && m.topics.length) {
              pool[m.topics[0]] = m.clients
            }
          }
          console.log(pool)
        }
      )
    }

    async function onCreateWorkspace(e: Event) {
      e.preventDefault()
      if (roomName.value) {
        // TODO
        // const {} = await createGist(roomName.value, sources)
        const { id, peer } = await p2pCreateRoom({
          onReceive(e) {
            console.log('root', e)
          },
        })
        peer.on('connection', (conn) => {
          conn.on('open', () => {
            conn.send({
              type: 'initial-sources',
              data: sources,
            })
            console.log('initial-sources', sources)
          })
        })
        await onCall(config.audio, config.video, peer, canvasContainer.current)
        peer.on('close', () => {
          config.disabledCreateRoom = false
          config.disabledJoinRoom = false
        })
        peer.on('disconnected', (currentId) => {
          console.log(id, currentId)
        })

        sourceRoomId.value = id
        share.value = `${location.origin}/explorer?room_id=${id}`

        const { monacoBinding, provider } = await connectMonaco(
          sources[0].name,
          id,
          namespace,
          false
        )
        connectMonacoInstance.current = provider
        onMessageWithMonaco(provider)

        config.disabledCreateRoom = true
        config.disabledJoinRoom = true
      }
    }

    async function onAddWorkspace(e: Event) {
      e.preventDefault()
      if (targetRoomId.value) {
        // TODO confirm continue
        const { peer, conn } = await p2pConnectRoom(targetRoomId.value)
        // 获取到 remote sources 数据
        const sources = await getSources(conn)
        // 更新本地 sources
        onUpdateSources(sources)

        const stream = await onCall(
          config.audio,
          config.video,
          peer,
          canvasContainer.current
        )
        await call(peer, targetRoomId.value, stream, canvasContainer.current)
        peer.on('close', () => {
          config.disabledCreateRoom = false
          config.disabledJoinRoom = false
        })

        const name = sources[0].name
        const { model } = await getModal(name, namespace)
        model.setValue('')
        const { monacoBinding, provider } = await connectMonaco(
          name,
          targetRoomId.value,
          namespace,
          true
        )
        connectMonacoInstance.current = provider
        onMessageWithMonaco(provider)

        config.disabledCreateRoom = true
        config.disabledJoinRoom = true
      }
    }

    exposeComponent({
      leave: (id) => {
        connectMonacoInstance.current?.destroy()
        const source = sources.find((source) => source.uuid === id)
        if (source) {
          pool[`${targetRoomId.value || sourceRoomId.value}_${source.name}`]--
          console.log(pool)
        }
      },
      enter: async (id) => {
        if (config.disabledCreateRoom || config.disabledJoinRoom) {
          const source = sources.find((source) => source.uuid === id)
          if (source) {
            const clients =
              pool[
                `${targetRoomId.value || sourceRoomId.value}_${source.name}`
              ] || 0
            if (clients > 0) {
              const { model } = await getModal(source.name, namespace)
              model.setValue('')
            }
            const { provider } = await connectMonaco(
              source.name,
              targetRoomId.value || sourceRoomId.value,
              namespace,
              true
            )
            connectMonacoInstance.current = provider
          }
        }
      },
    } as ExposeInfo)

    return (
      <div class="text-white text-sm">
        {token || isSSR ? (
          <div class="mb-4">
            {info.value.avatar_url ? (
              <img
                src={info.value.avatar_url}
                alt="avatar"
                class="mx-auto h-[100px] rounded-[50px]"
              />
            ) : (
              <div class="h-[100px]"></div>
            )}
            <div class="text-center my-2">{info.value.name}</div>
            <Button onClick={onOpenGist}>我的代码</Button>
            <form>
              <FormItem name="房间名称">
                <Input
                  type="text"
                  placeholder="请输入房间名"
                  required
                  value={roomName.value}
                  onChange={(e) =>
                    (roomName.value = (e.target as HTMLInputElement).value)
                  }
                />
              </FormItem>
              <Button
                onClick={onCreateWorkspace}
                disabled={config.disabledCreateRoom}
              >
                创建协同
              </Button>
              <FormItem name="分享">
                <Input
                  type="text"
                  placeholder="请创建房间后拷贝分享"
                  value={share.value}
                  disabled
                />
              </FormItem>
            </form>
          </div>
        ) : (
          <Button onClick={onOAuth}>
            <GithubIcon class="w-7 h-7" />
          </Button>
        )}

        <form>
          <FormItem name="房间标识符">
            <Input
              id="other"
              placeholder="请输入房间名或者访问分享的链接"
              required
              value={targetRoomId.value}
              onChange={(e) =>
                (targetRoomId.value = (e.target as HTMLInputElement).value)
              }
            />
          </FormItem>
          <Button onClick={onAddWorkspace} disabled={config.disabledJoinRoom}>
            加入协同
          </Button>
        </form>
        <ul ref={canvasContainer}></ul>
      </div>
    )
  }
)
