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
    })
    const info = useGithubInfo(token)
    const canvasContainer = createRef<HTMLDivElement>()

    function onOAuth() {
      location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user,gist,public_repo`
    }

    function onOpenGist() {}

    async function onCreateWorkspace() {
      if (roomName.value) {
        // TODO
        // const {} = await createGist(roomName.value, sources)
        const { id, peer } = await p2pReady()
        share.value = `${location.origin}/explorer?room_id=${id}`
        peer.on('call', async (call) => {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          })
          call.answer(stream)

          call.on('stream', (stream) => {
            streamWithCanvas(stream, canvasContainer.current, call.connectionId)
          })
          call.on('close', () => {
            leaveWithCanvas(canvasContainer.current, call.connectionId)
          })
        })

        await connectMonaco(sources[0].name, id, namespace, false)
      }
    }

    async function onAddWorkspace() {
      if (roomOtherName.value) {
        const { peer } = await p2pConnect(roomOtherName.value, {
          onReceive(e) {},
        })
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: config.audio,
          video: config.video,
        })
        const call = peer.call(roomOtherName.value, stream)
        call.on('stream', (stream) => {
          streamWithCanvas(stream, canvasContainer.current, call.connectionId)
        })
        call.on('close', () => {
          leaveWithCanvas(canvasContainer.current, call.connectionId)
        })

        const { model } = await getModal(sources[0].name, namespace)
        model.setValue('')
        await connectMonaco(
          sources[0].name,
          roomOtherName.value,
          namespace,
          true
        )
      }
    }

    return (
      <div>
        <div class="text-white">
          {token ? (
            <div>
              <img src={info.value.avatar_url} alt="avatar" />
              <div>{info.value.name}</div>
            </div>
          ) : (
            <button onClick={onOAuth}>
              <GithubIcon />
            </button>
          )}

          <button
            class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2"
            onClick={onOpenGist}
          >
            我的代码
          </button>
          <label for="self" class="mb-1">
            房间名称
          </label>
          <input
            type="text"
            id="self"
            class="w-full text-zinc-900 px-2"
            value={roomName.value}
            onChange={(e) =>
              (roomName.value = (e.target as HTMLInputElement).value)
            }
          />
          <button
            class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2"
            onClick={onCreateWorkspace}
          >
            创建协同
          </button>
          <input
            type="text"
            id="share"
            class="w-full text-zinc-900 px-2"
            value={share.value}
            disabled
          />
          <label for="other" class="mb-1">
            房间标识符
          </label>
          <input
            type="text"
            id="other"
            class="w-full text-zinc-900 px-2"
            value={roomOtherName.value}
            onChange={(e) =>
              (roomOtherName.value = (e.target as HTMLInputElement).value)
            }
          />
          <button
            class="px-4 py-1 text-white border rounded-sm border-sky-100 block my-2"
            onClick={onAddWorkspace}
          >
            加入协同
          </button>
          <div ref={canvasContainer}></div>
        </div>
      </div>
    )
  }
)
