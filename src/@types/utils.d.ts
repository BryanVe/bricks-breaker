type BodyPix = import('@tensorflow-models/body-pix').BodyPix

interface SegmentVideoArgs {
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
  net: BodyPix
  selectedImageKey?: string
}

type SegmentVideo = (args: SegmentVideoArgs) => void

interface LoopVideoArgs extends SegmentVideoArgs {
  fps: number
}

type LoopVideo = (args: LoopVideoArgs) => void
