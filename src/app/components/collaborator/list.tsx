import { FC, createRef, onAfterMount } from 'gyron'

interface CollaboratorListProps {
  id: string
  stream: MediaStream
}

export const Collaborator = FC<CollaboratorListProps>(({ id, stream }) => {
  const container = createRef<HTMLCanvasElement>()
  onAfterMount(() => {
    const canvas = container.current
    const ctx = canvas.getContext('2d')
    const video = document.createElement('video')

    canvas.width = 200
    canvas.id = `c_${id}`
    video.id = `v_${id}`
    video.autoplay = true
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
  })
  return (
    <div class="my-4" id={`collaborator_${id}`}>
      <div class="text-gray-700 dark:text-gray-100 my-2">{id}</div>
      <canvas class="rounded-sm" ref={container}></canvas>
    </div>
  )
})
