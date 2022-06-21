const pointSize = 8

export const detectFace: DetectFace = async (args) => {
  const { detector, video, canvas } = args

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const faces = await detector.estimateFaces(video, {
      flipHorizontal: false,
    })
    if (faces.length > 0) {
      const face = faces[0]

      face.keypoints.forEach((keypoint) => {
        ctx.beginPath()
        ctx.fillStyle = '#00ff2f'
        ctx.rect(
          keypoint.x * (canvas.width / video.videoWidth) - pointSize / 2,
          keypoint.y * (canvas.height / video.videoHeight) - pointSize / 2,
          pointSize,
          pointSize
        )
        ctx.fill()
      })
    }
  }
}
