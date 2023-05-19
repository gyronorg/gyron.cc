import { FC, createRef, onAfterMount, useReactive } from 'gyron'
import { AudioIcon, VideoIcon } from '../icons'
import classNames from 'classnames'

interface CollaboratorListProps {
  id: string
  stream: MediaStream
}

export const Collaborator = FC<CollaboratorListProps>(({ id, stream }) => {
  const container = createRef<HTMLCanvasElement>()
  const config = useReactive({
    video: true,
    audio: true,
  })

  onAfterMount(() => {
    const canvas = container.current
    const ctx = canvas.getContext('2d')
    const video = document.createElement('video')
    if (id === 'self') {
      video.muted = true
    }

    canvas.width = 200
    canvas.id = `c_${id}`
    video.id = `v_${id}`
    video.autoplay = true
    video.srcObject = stream
    video.play()

    video.addEventListener('play', (e) => {
      function step() {
        if (video) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    })
  })

  function onAudio() {
    config.audio = !config.audio
    stream.getTracks().forEach((item) => {
      if (item.kind === 'audio') {
        item.enabled = !item.enabled
      }
    })
  }

  function onVideo() {
    config.video = !config.video
    stream.getTracks().forEach((item) => {
      if (item.kind === 'video') {
        item.enabled = !item.enabled
      }
    })
  }

  return (
    <div class="my-4 relative" id={`collaborator_${id}`}>
      <div class="text-gray-100 my-2">{id}</div>
      <canvas class="rounded-sm" ref={container}></canvas>
      {id === 'self' && (
        <div class="absolute bottom-0 left-0 px-3 w-full h-[34px] text-white flex items-center gap-3 bg-black/30 backdrop-blur supports-backdrop-blur:bg-white/95">
          <button
            onClick={onAudio}
            class={classNames(config.audio ? 'text-white' : 'text-red-700')}
          >
            <AudioIcon class="w-[18px]" />
          </button>
          <button
            onClick={onVideo}
            class={classNames(config.video ? 'text-white' : 'text-red-700')}
          >
            <VideoIcon />
          </button>
        </div>
      )}
    </div>
  )
})
