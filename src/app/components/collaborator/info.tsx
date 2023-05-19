import {
  createRef,
  exposeComponent,
  FC,
  onAfterUpdate,
  useReactive,
  useValue,
  createInstance,
  nextRender,
  useComputed,
} from 'gyron'
import { GithubIcon } from '../icons'
import { get } from '@/utils/fetch'
import { CLIENT_ID } from 'src/server/constant'
import {
  CreateResponseGist,
  GithubInfo,
  clearGithubAccess,
  setGithubInfo,
} from '@/utils/github'
import { createGist, deleteGist, getGistList, patchGist } from './gist'
import { readyPeer } from './p2p'
import { Source } from '../explorer/wrapper'
import { connectMonaco, send } from './util'
import { Button } from '../button'
import { Input } from '../input'
import { FormItem } from '../formItem'
import { Collaborator } from './list'
import { confirm } from '../confirm'
import { Modal } from '../modal'
import Peer, { DataConnection, MediaConnection } from 'peerjs'
import type { WebrtcProvider } from 'y-webrtc'

interface CollaboratorInfoProps {
  token: string
  namespace: string
  sources: Source[]
  onUpdateSources?: (e: Source[]) => void
}

export interface ExposeInfo {
  leave: (id: string) => void
  enter: (id: string) => void
  initial: (sources: Source[]) => void
}

function useGithubInfo(token: string) {
  const info = useValue<Partial<GithubInfo>>({})
  function getInfo() {
    get('/api/github/user').then((data: GithubInfo) => {
      if (data.name) {
        info.value = data
        setGithubInfo(data)
      } else {
        clearGithubAccess()
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
          if (b.token) {
            getInfo()
          }
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

function handlerCall(call: MediaConnection, container: HTMLDivElement) {
  call.on('stream', (stream) => {
    renderStreamWithCanvas(stream, container, call.connectionId)
  })
  call.on('error', () => {
    removeStreamWithCanvas(container, call.connectionId)
  })
  call.on('close', () => {
    removeStreamWithCanvas(container, call.connectionId)
  })
}

async function onCall(peer: Peer, container: HTMLDivElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  renderStreamWithCanvas(stream, container, 'self')
  peer.on('call', async (call) => {
    call.answer(stream)
    handlerCall(call, container)
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
  handlerCall(call, container)
  return call
}

function handlePeerDisconnect(peer: Peer) {
  // manually close the peer connections
  for (let conns in peer.connections) {
    peer.connections[conns].forEach((conn) => {
      conn.peerConnection.close()

      // close it using peerjs methods
      if (conn.close) conn.close()
    })
  }
}

function createEditorHook() {
  return {
    getSources: (conn: DataConnection) => {
      return new Promise<Source[]>((resolve) => {
        conn.on('data', (e: any) => {
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
    const visible = useValue(false)
    const gistList = useValue<CreateResponseGist[]>([])
    const targetRoomId = useValue(
      isSSR ? '' : new URLSearchParams(location.search).get('room_id')
    )
    const config = useReactive({
      disabledCreateRoom: false,
      disabledJoinRoom: false,
    })
    const info = useGithubInfo(token)
    const canvasContainer = createRef<HTMLDivElement>()
    const connectMonacoInstance = createRef<WebrtcProvider>()
    const connectPeer = createRef<Peer>()
    const gistId = createRef<string>()
    const stream = createRef<MediaStream>()
    const disabledActionRoom = useComputed(() => {
      return config.disabledCreateRoom || config.disabledJoinRoom
    })
    const { getSources } = createEditorHook()

    function onOpenGist() {
      getGistList().then((value) => {
        visible.value = true
        gistList.value = value
      })
    }

    async function onConnectMonaco(
      peerId: string,
      hasCreate = false,
      name = sources[0].name
    ) {
      const { provider } = await connectMonaco(
        name,
        peerId,
        namespace,
        hasCreate
      )
      connectMonacoInstance.current = provider

      config.disabledCreateRoom = config.disabledJoinRoom = true
    }

    function onClosePeer() {
      config.disabledCreateRoom = config.disabledJoinRoom = false
    }

    async function onCreateWorkspace(e?: Event, originGistId?: string) {
      if (roomName.value) {
        e?.preventDefault()
        const { id: _gistId } = originGistId
          ? { id: originGistId }
          : await createGist(sources, roomName.value)
        const { id, peer } = await readyPeer(onClosePeer)
        peer.on('connection', (conn) => {
          conn.on('open', () => {
            conn.send({
              type: 'initial-sources',
              data: sources,
            })
            conn.on('close', () => {
              console.log('close', conn.connectionId)
              handlePeerDisconnect(peer)
            })
          })
        })
        const _stream = await onCall(peer, canvasContainer.current)
        await onConnectMonaco(id)

        stream.current = _stream
        sourceRoomId.value = id
        gistId.current = _gistId
        connectPeer.current = peer
        share.value = `${location.origin}/explorer?room_id=${id}`
      }
    }

    async function onAddWorkspace(e: Event) {
      if (targetRoomId.value) {
        e.preventDefault()
        // TODO confirm continue
        const { peer } = await readyPeer(onClosePeer)
        const conn = peer.connect(targetRoomId.value)
        // 获取到 remote sources 数据
        const sources = await getSources(conn)
        // 更新本地 sources
        onUpdateSources(sources)
        await nextRender()

        const _stream = await onCall(peer, canvasContainer.current)
        await call(peer, targetRoomId.value, _stream, canvasContainer.current)
        await onConnectMonaco(targetRoomId.value, true)
        connectPeer.current = peer
        stream.current = _stream
      }
    }

    async function onLeaveWorkspace() {
      if (connectPeer.current) {
        gistId.current = null
        connectPeer.current.destroy()
        config.disabledCreateRoom = config.disabledJoinRoom = false
        if (stream.current) {
          stream.current.getTracks().forEach((item) => item.stop())
          removeStreamWithCanvas(canvasContainer.current, 'self')
        }
      }
    }

    async function onReopenRoom(gist: CreateResponseGist) {
      const go = async () => {
        visible.value = false
        roomName.value = gist.name
        targetRoomId.value = ''
        onUpdateSources(gist.sources)
        await nextRender()
        onCreateWorkspace(null, gist.id)
      }
      if (disabledActionRoom.value) {
        confirm(`确认离开当前房间，进入 "${gist.name}" ?`)
          .then(go)
          .catch(() => {})
      } else {
        go()
      }
    }

    async function onRemoveRoom(gist: CreateResponseGist) {
      confirm(`确定删除 ${gist.name} 房间吗?`)
        .then(() => {
          deleteGist(gist.id).then(onOpenGist)
        })
        .catch(() => {})
    }

    exposeComponent({
      leave: (id) => {
        if (connectMonacoInstance.current) {
          connectMonacoInstance.current.destroy()
          send(connectMonacoInstance.current, {
            type: 'leave',
            sources: sources,
            topic: connectMonacoInstance.current.roomName,
          })
        }
      },
      enter: async (id) => {
        if (disabledActionRoom.value) {
          const source = sources.find((source) => source.uuid === id)
          if (source) {
            await onConnectMonaco(
              targetRoomId.value || sourceRoomId.value,
              true,
              source.name
            )
          }
        }
      },
      initial(_) {
        console.log('update sources', _)
        sources = _
        if (gistId.current) {
          patchGist(gistId.current, _)
        }
      },
    } as ExposeInfo)

    return (
      <div class="text-white text-sm h-full flex flex-col">
        {token ? (
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
            <Modal
              visible={visible.value}
              onClose={() => (visible.value = false)}
            >
              <ul class="min-w-[400px]">
                {gistList.value.map((item) => (
                  <li class="my-2 flex items-center justify-between">
                    <div class="w-[160px] overflow-hidden text-ellipsis">
                      {item.name}
                    </div>
                    <div class="flex items-center gap-3">
                      <Button
                        type="text"
                        disabled={item.id === gistId.current}
                        onClick={() => onRemoveRoom(item)}
                      >
                        移除
                      </Button>
                      <Button type="text" onClick={() => onReopenRoom(item)}>
                        开启
                      </Button>
                    </div>
                  </li>
                ))}
                {gistList.value.length === 0 && <div>无数据</div>}
              </ul>
            </Modal>
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
                创建协同房间
              </Button>
              <FormItem name="分享">
                <Input
                  type="text"
                  placeholder="请创建协同后拷贝分享"
                  value={share.value}
                  disabled
                />
              </FormItem>
            </form>
          </div>
        ) : (
          <Button onClick={onOAuth} className="py-2">
            <GithubIcon class="w-7 h-7 mx-auto" />
          </Button>
        )}

        <form>
          <FormItem name="房间标识符">
            <Input
              id="other"
              placeholder="请输入房间ID或者访问分享的链接"
              required
              value={targetRoomId.value}
              onChange={(e) =>
                (targetRoomId.value = (e.target as HTMLInputElement).value)
              }
            />
          </FormItem>
          <div class="flex items-center justify-between gap-3">
            <Button onClick={onAddWorkspace} disabled={config.disabledJoinRoom}>
              加入
            </Button>
            <Button
              onClick={onLeaveWorkspace}
              disabled={!config.disabledJoinRoom}
            >
              离开
            </Button>
          </div>
        </form>
        <ul class="flex-1 overflow-auto" ref={canvasContainer}></ul>
      </div>
    )
  }
)
