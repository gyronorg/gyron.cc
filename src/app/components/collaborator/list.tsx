import { FC, createRef, onAfterMount, useReactive } from 'gyron'
import { AudioIcon, VideoIcon } from '../icons'
import { load } from '@tensorflow-models/deeplab'
import '@tensorflow/tfjs-backend-webgl'
import classNames from 'classnames'

interface CollaboratorListProps {
  id: string
  stream: MediaStream
}

function loadModule() {
  return load({ base: 'pascal', quantizationBytes: 2 })
}

function convertBlackToTransparent(pixelData: Uint8ClampedArray) {
  for (let i = 0, len = pixelData.length; i < len; i += 4) {
    if (
      pixelData[i] === 0 &&
      pixelData[i + 1] === 0 &&
      pixelData[i + 2] === 0
    ) {
      pixelData[i + 3] = 0
    }
  }
  return pixelData
}

export const Collaborator = FC<CollaboratorListProps>(({ id, stream }) => {
  const container = createRef<HTMLCanvasElement>()
  const backgroundContainer = createRef<HTMLCanvasElement>()
  const config = useReactive({
    video: true,
    audio: true,
  })

  onAfterMount(() => {
    const canvas = container.current
    const background = backgroundContainer.current
    const ctx = canvas.getContext('2d')
    const ctxBg = background.getContext('2d')
    const video = document.createElement('video')
    if (id === 'self') {
      video.muted = true
    }

    canvas.id = `c_${id}`
    video.id = `v_${id}`
    video.autoplay = true
    video.srcObject = stream
    video.play()

    video.addEventListener('play', async () => {
      const module = await loadModule()
      async function step() {
        if (video) {
          const { height, width, segmentationMap } = await module.segment(video)
          const segmentationMapData = new ImageData(
            convertBlackToTransparent(segmentationMap),
            width,
            height
          )

          background.width = width
          background.height = height
          ctxBg.putImageData(segmentationMapData, 0, 0)
          ctxBg.filter = 'blur(6px)'
          ctxBg.globalCompositeOperation = 'source-out'
          ctxBg.drawImage(video, 0, 0, background.width, background.height)

          canvas.width = width
          canvas.height = height
          ctx.putImageData(segmentationMapData, 0, 0)
          ctx.globalCompositeOperation = 'source-in'
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
      <div class="relative h-[150px]">
        <canvas
          class="rounded-sm absolute w-full h-[150px]"
          ref={backgroundContainer}
        ></canvas>
        <canvas
          class="rounded-sm absolute w-full h-[150px]"
          ref={container}
        ></canvas>
        {id === 'self' && (
          <div class="absolute bottom-0 left-0 px-3 w-full h-[28px] text-white flex items-center gap-3 bg-black/30 backdrop-blur z-10">
            <button
              onClick={onAudio}
              class={classNames(config.audio ? 'text-white' : 'text-red-600')}
            >
              <AudioIcon class="w-[18px]" />
            </button>
            <button
              onClick={onVideo}
              class={classNames(config.video ? 'text-white' : 'text-red-600')}
            >
              <VideoIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
