import {
  createRef,
  FC,
  onAfterUpdate,
  useReactive,
  useValue,
  useWatch,
} from 'gyron'
import { GithubIcon } from '../icons'
import { get } from '@/utils/fetch'
import { CLIENT_ID } from 'src/server/constant'
import { GithubInfo, setGithubInfo } from '@/utils/github'
import { createGist } from './gist'
import { p2pConnect, p2pReady } from './room'
import { Source } from '../explorer/wrapper'
import { WebrtcProvider } from 'y-webrtc'
import { getEditorWithElement, getModal } from '../explorer/hook'
import * as Y from 'yjs'
import Peer from 'peerjs'

interface CollaboratorInfoProps {
  token: string
  namespace: string
  sources: Source[]
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

function streamWithCanvas(
  stream: MediaStream,
  container: HTMLDivElement,
  id: string
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const video = document.createElement('video')

  canvas.width = 200
  canvas.id = `c_${id}`
  video.id = `v_${id}`
  video.autoplay = true
  video.style.display = 'none'
  video.srcObject = stream
  video.addEventListener('play', (e) => {
    function step() {
      if (video) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  })
  container.append(canvas)
}

function leaveWithCanvas(container: HTMLDivElement, id: string) {
  const canvas = container.querySelector(`#c_${id}`)
  const video = container.querySelector<HTMLVideoElement>(`#v_${id}`)
  video?.pause()
  canvas?.remove()
  video?.remove()
}

async function connectMonaco(
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

  const provider = new WebrtcProvider(id, ydoc, {
    signaling: [signal],
  })

  const type = ydoc.getText('monaco')

  type.insert(0, model.getValue())
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
  return monacoBinding
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
      streamWithCanvas(stream, container, call.connectionId)
    })
    call.on('close', () => {
      leaveWithCanvas(container, call.connectionId)
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
    streamWithCanvas(stream, container, call.connectionId)
  })
  call.on('close', () => {
    leaveWithCanvas(container, call.connectionId)
  })
  return call
}

export const CollaboratorInfo = FC<CollaboratorInfoProps>(
  ({ token, sources, namespace, isSSR }) => {
    const share = useValue('')
    const roomName = useValue('')
    const roomOtherName = useValue(
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

    function onOAuth() {
      location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user,gist,public_repo`
    }

    function onOpenGist() {}

    async function onCreateWorkspace(e: Event) {
      if (roomName.value) {
        e.preventDefault()
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: config.audio,
          video: config.video,
        })
        // TODO
        // const {} = await createGist(roomName.value, sources)
        const { id, peer } = await p2pReady()
        share.value = `${location.origin}/explorer?room_id=${id}`
        await onCall(config.audio, config.video, peer, canvasContainer.current)
        peer.on('connection', (conn) => {
          console.log(conn)
        })
        peer.on('close', () => {
          config.disabledCreateRoom = false
          config.disabledJoinRoom = false
        })
        peer.on('disconnected', (currentId) => {
          console.log(id, currentId)
        })

        await connectMonaco(sources[0].name, id, namespace, false)

        config.disabledCreateRoom = true
        config.disabledJoinRoom = true
      }
    }

    async function onAddWorkspace(e: Event) {
      if (roomOtherName.value) {
        e.preventDefault()
        // TODO confirm continue
        const { peer } = await p2pConnect(roomOtherName.value, {
          onReceive(e) {},
        })
        const stream = await onCall(
          config.audio,
          config.video,
          peer,
          canvasContainer.current
        )
        await call(peer, roomOtherName.value, stream, canvasContainer.current)
        peer.on('close', () => {
          config.disabledCreateRoom = false
          config.disabledJoinRoom = false
        })

        const { model } = await getModal(sources[0].name, namespace)
        model.setValue('')
        await connectMonaco(
          sources[0].name,
          roomOtherName.value,
          namespace,
          true
        )

        config.disabledCreateRoom = true
        config.disabledJoinRoom = true
      }
    }

    return (
      <div class="text-white text-sm">
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
            <button
              class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2 disabled:border-stone-700 disabled:text-stone-500 active:translate-x-0.5 active:translate-y-0.5 hover:bg-black/20 w-full"
              onClick={onOpenGist}
            >
              我的代码
            </button>
            <form>
              <label for="self" class="mb-2 mt-3 block">
                房间名称
              </label>
              <input
                type="text"
                id="self"
                class="w-full text-zinc-900 px-2 py-1 rounded-sm invalid:border-red-600 dark:text-white placeholder:text-gray-600"
                placeholder="请输入房间名"
                required
                value={roomName.value}
                onChange={(e) =>
                  (roomName.value = (e.target as HTMLInputElement).value)
                }
              />
              <button
                class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2 disabled:border-stone-700 disabled:text-stone-500 active:translate-x-0.5 active:translate-y-0.5 hover:bg-black/20 w-full"
                onClick={onCreateWorkspace}
                disabled={config.disabledCreateRoom}
              >
                创建协同
              </button>
              <label class="mb-2 mt-3 block">分享</label>
              <input
                type="text"
                id="share"
                class="w-full text-zinc-900 px-2 py-1 rounded-sm dark:text-white placeholder:text-gray-600"
                placeholder="请创建房间后拷贝分享"
                value={share.value}
                disabled
              />
            </form>
          </div>
        ) : (
          <button
            onClick={onOAuth}
            class="flex justify-center w-full border rounded-sm border-sky-100 p-2 hover:bg-black/20 mb-4"
          >
            <GithubIcon class="w-7 h-7" />
          </button>
        )}

        <form>
          <label for="other" class="mb-2 mt-3 block">
            房间标识符
          </label>
          <input
            type="text"
            id="other"
            class="w-full text-zinc-900 dark:text-white placeholder:text-gray-600 px-2 py-1 rounded-sm invalid:border-red-600"
            placeholder="请输入房间名或者访问分享的链接"
            required
            value={roomOtherName.value}
            onChange={(e) =>
              (roomOtherName.value = (e.target as HTMLInputElement).value)
            }
          />
          <button
            class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2 disabled:border-stone-700 disabled:text-stone-500 active:translate-x-0.5 active:translate-y-0.5 hover:bg-black/20 w-full"
            onClick={onAddWorkspace}
            disabled={config.disabledJoinRoom}
          >
            加入协同
          </button>
        </form>
        <div ref={canvasContainer}></div>
      </div>
    )
  }
)
