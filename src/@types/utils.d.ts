type BodyPix = import('@tensorflow-models/body-pix').BodyPix

interface SegmentVideoArgs {
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
  net: BodyPix
}

type SegmentVideo = (args: SegmentVideoArgs) => void

interface LoopVideoArgs {
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
  net: BodyPix
  fps: number
}

type LoopVideo = (args: LoopVideoArgs) => void
