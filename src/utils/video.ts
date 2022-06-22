const pointSize = 8
export const STATES = {
  CANVAS_ERROR: 'CANVAS_ERROR',
  NO_FACES_ERROR: 'NO_FACES_ERROR',
  MORE_FACES_ERROR: 'MORE_FACES_ERROR',
  STILL: 'STILL',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

export const detectFace: DetectFace = async (args) => {
  const { detector, video, canvas } = args

  const ctx = canvas.getContext('2d')
  if (!ctx) return STATES.CANVAS_ERROR

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  const faces = await detector.estimateFaces(video)

  if (faces.length === 0) return STATES.NO_FACES_ERROR
  if (faces.length > 1) return STATES.MORE_FACES_ERROR

  const resizeXFactor = canvas.width / video.videoWidth
  const resizeYFactor = canvas.width / video.videoWidth
  const face = faces[0]
  const lineVector = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  }

  face.keypoints.forEach((keypoint) => {
    if (keypoint.name === 'rightEye')
      lineVector.start = {
        x: keypoint.x * resizeYFactor,
        y: keypoint.y * resizeYFactor,
      }

    if (keypoint.name === 'leftEye')
      lineVector.end = {
        x: keypoint.x * resizeYFactor,
        y: keypoint.y * resizeYFactor,
      }

    ctx.beginPath()
    ctx.fillStyle = '#00ff2f'
    ctx.rect(
      keypoint.x * resizeXFactor - pointSize / 2,
      keypoint.y * resizeYFactor - pointSize / 2,
      pointSize,
      pointSize
    )
    ctx.fill()
  })

  const vect1 = [canvas.width - lineVector.start.x, 0]
  const vect2 = [
    lineVector.end.x - lineVector.start.x,
    lineVector.end.y - lineVector.start.y,
  ]

  const dot = vect1[0] * vect2[0] + vect1[1] * vect2[1]
  const norm1 = Math.sqrt(Math.pow(vect1[0], 2) + Math.pow(vect1[1], 2))
  const norm2 = Math.sqrt(Math.pow(vect2[0], 2) + Math.pow(vect2[1], 2))

  const theta = Math.acos(dot / (norm1 * norm2))
  const degTheta = ((theta * 180) / Math.PI) * (vect2[1] > vect1[1] ? 1 : -1)

  const threshold = 10

  if (Math.abs(degTheta) < threshold) return STATES.STILL

  return Math.abs(degTheta) === degTheta ? STATES.LEFT : STATES.RIGHT
}
