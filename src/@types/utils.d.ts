type FaceDetector = import('@tensorflow-models/face-detection').FaceDetector

interface LoopVideoArgs {
  detector: FaceDetector
}

type LoopVideo = (args: LoopVideoArgs) => Promise<void>

interface DetectFaceArgs extends LoopVideoArgs {
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
}

type DetectFace = (args: DetectFaceArgs) => Promise<string>
