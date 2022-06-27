type FaceDetector = import('@tensorflow-models/face-detection').FaceDetector

type LoopVideo = (detector: FaceDetector) => void

interface DetectFaceArgs {
  detector: FaceDetector
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
}

interface DetectFaceReturn {
  state: string
  theta: number
}

type DetectFace = (args: DetectFaceArgs) => Promise<DetectFaceReturn>
