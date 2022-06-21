import { useRef, useEffect, useCallback, useContext } from 'react'
import {
  createDetector,
  SupportedModels,
} from '@tensorflow-models/face-detection'
import { VERSION } from '@mediapipe/face_detection'

import { ready } from '@tensorflow/tfjs'

import { Container, Content, FaceDetect } from 'style'
import { Video, Filter, Sidebar } from 'components'
import { detectFace } from 'utils'
import { ThemeContext } from 'theme'

const FPS = 1000 / 30
const PADDING = 16
const ASPECT_RATIO = 16 / 9

const App = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useContext(ThemeContext)

  const loopVideo = useCallback<LoopVideo>((args) => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.paused ||
      videoRef.current.ended
    )
      return

    const { detector } = args
    const { width, height } = videoRef.current.getBoundingClientRect()

    canvasRef.current.width = width
    canvasRef.current.height = height

    detectFace({
      detector,
      canvas: canvasRef.current,
      video: videoRef.current,
    })
    setTimeout(() => loopVideo(args), FPS)
  }, [])

  const captureVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: FPS,
          aspectRatio: {
            ideal: ASPECT_RATIO,
          },
        },
      })

      if (!videoRef.current) throw new Error('Video could not be captured')
      videoRef.current.srcObject = stream
    } catch (error) {
      console.log(error)
    }
  }, [videoRef])

  const runDetector = useCallback(async () => {
    try {
      if (!videoRef.current) throw new Error('Video could not be captured')

      await ready()
      const detector = await createDetector(
        SupportedModels.MediaPipeFaceDetector,
        {
          runtime: 'mediapipe',
          solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${VERSION}`,
        }
      )

      videoRef.current.addEventListener(
        'play',
        () =>
          loopVideo({
            detector,
          }),
        false
      )
    } catch (error) {
      console.log(error)
    }
  }, [videoRef, loopVideo])

  useEffect(() => {
    captureVideo()
  }, [captureVideo])

  useEffect(() => {
    runDetector()
  }, [runDetector])

  // useEffect(() => {
  //   if (testRef.current) {
  //     const width = 900
  //     const height = width / ASPECT_RATIO

  //     testRef.current.width = width
  //     testRef.current.height = height
  //     console.log(testRef.current)
  //     const ctx = testRef.current.getContext('2d')

  //     if (ctx) {
  //       ctx.beginPath()
  //       ctx.fillStyle = '#000'
  //       ctx.rect(PADDING, height - 20 - PADDING, 200, 20)
  //       ctx.fill()
  //     }
  //   }
  // }, [])

  return (
    <Container backgroundColor={theme.background}>
      <FaceDetect height={200}>
        <Video ref={videoRef} />
        <Filter ref={canvasRef} />
      </FaceDetect>
      <Sidebar />
      <Content padding={PADDING}>GAME</Content>
      {/* <canvas
        ref={testRef}
        // width={1800}
        // height={1800 / ASPECT_RATIO}
        style={{
          backgroundColor: '#f2f2f2',
          borderRadius: 10,
          justifySelf: 'center',
          alignSelf: 'center',
        }}
      >
        a
      </canvas> */}
    </Container>
  )
}

export default App
