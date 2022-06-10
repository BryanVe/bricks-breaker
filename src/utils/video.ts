import { drawBokehEffect, toMask, drawMask } from '@tensorflow-models/body-pix'

export const segmentVideo: SegmentVideo = async (args) => {
  const { net, video, canvas, selectedImageKey } = args

  const backgroundBlurAmount = 10
  const edgeBlurAmount = 12
  const flipHorizontal = false

  const segmentation = await net.segmentPerson(video, {})

  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
  if (selectedImageKey) {
    const foregroundColor = { r: 0, g: 0, b: 0, a: 0 }
    const backgroundColor = { r: 0, g: 0, b: 0, a: 255 }
    const background = toMask(
      segmentation,
      foregroundColor,
      backgroundColor,
      true
    )

    drawMask(canvas, video, background, 1, 0)

    const ctx = canvas.getContext('2d')

    if (ctx) {
      const { width, height } = video.getBoundingClientRect()
      const image = ctx.getImageData(0, 0, width, height)

      for (let i = 0; i < image.data.length; i += 4)
        if (
          image.data[i] === 0 &&
          image.data[i + 1] === 0 &&
          image.data[i + 2] === 0
        )
          image.data[i + 3] = 0

      ctx.imageSmoothingEnabled = true
      ctx.putImageData(image, 0, 0)
    }
  } else
    drawBokehEffect(
      canvas,
      video,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    )
}
