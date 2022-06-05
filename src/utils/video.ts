import { drawBokehEffect } from '@tensorflow-models/body-pix'

export const segmentVideo: SegmentVideo = async (args) => {
  const { net, video, canvas } = args

  const backgroundBlurAmount = 10
  const edgeBlurAmount = 12
  const flipHorizontal = false

  const segmentation = await net.segmentPerson(video, {
    segmentationThreshold: 0.9,
  })

  drawBokehEffect(
    canvas,
    video,
    segmentation,
    backgroundBlurAmount,
    edgeBlurAmount,
    flipHorizontal
  )
}

export const loopVideo: LoopVideo = async (args) => {
  const { video, fps } = args

  if (video.paused || video.ended) return

  segmentVideo(args)
  setTimeout(() => loopVideo(args), fps)
}
