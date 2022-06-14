import { drawBokehEffect } from '@tensorflow-models/body-pix'

export const segmentVideo: SegmentVideo = async (args) => {
  const { net, video, canvas } = args

  const backgroundBlurAmount = 10
  const edgeBlurAmount = 12
  const flipHorizontal = false

  const segmentation = await net.segmentPerson(video, {})

  drawBokehEffect(
    canvas,
    video,
    segmentation,
    backgroundBlurAmount,
    edgeBlurAmount,
    flipHorizontal
  )
}
