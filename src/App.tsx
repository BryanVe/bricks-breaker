import { useRef, useEffect, useCallback, useContext, useState } from 'react'
import {
  createDetector,
  SupportedModels,
} from '@tensorflow-models/face-detection'
import { VERSION } from '@mediapipe/face_detection'

import { ready } from '@tensorflow/tfjs'

import { Container, Content, FaceDetect } from 'style'
import { Video, Filter, Sidebar } from 'components'
import { detectFace, STATES } from 'utils'
import { ThemeContext } from 'theme'

const FPS = 1000 / 30
const PADDING = 16
const ASPECT_RATIO = 16 / 9
const BAR_PROPERTIES = {
  width: 200,
  height: 20,
  color: '#000',
}

const App = () => {
  const { theme } = useContext(ThemeContext)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<HTMLCanvasElement | null>(null)
  const startRef = useRef(false)
  const [barPosition, setBarPosition] = useState({
    posX: 0,
    posY: 0,
  })

  const moveRight = () =>
    setBarPosition((barPosition) => {
      if (!gameRef.current) return barPosition

      const maxPosX = gameRef.current.width - BAR_PROPERTIES.width
      if (barPosition.posX >= maxPosX)
        return {
          ...barPosition,
          posX: maxPosX,
        }
      else
        return {
          ...barPosition,
          posX: barPosition.posX + 10,
        }
    })

  const moveLeft = () =>
    setBarPosition((barPosition) => {
      const minPosX = 0
      if (barPosition.posX <= minPosX)
        return {
          ...barPosition,
          posX: minPosX,
        }
      else
        return {
          ...barPosition,
          posX: barPosition.posX - 10,
        }
    })

  const clearFrame = (ctx: CanvasRenderingContext2D) =>
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const loopVideo = useCallback<LoopVideo>(async (args) => {
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

    const state = await detectFace({
      detector,
      canvas: canvasRef.current,
      video: videoRef.current,
    })

    if (startRef.current) {
      switch (state) {
        case STATES.RIGHT: {
          moveRight()
          break
        }
        case STATES.LEFT: {
          moveLeft()
          break
        }
        default: {
          break
        }
      }
    }

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

  // draw full game
  useEffect(() => {
    if (gameRef.current) {
      // define board dimensions
      const width = 900
      const height = width / ASPECT_RATIO

      gameRef.current.width = width
      gameRef.current.height = height

      const ctx = gameRef.current.getContext('2d')
      if (ctx) {
        // draw bar
        const initialBarPosition = {
          posX: (gameRef.current.width - BAR_PROPERTIES.width) / 2,
          posY: gameRef.current.height - BAR_PROPERTIES.height - PADDING,
        }
        ctx.beginPath()
        ctx.fillStyle = BAR_PROPERTIES.color
        ctx.rect(
          initialBarPosition.posX,
          initialBarPosition.posY,
          BAR_PROPERTIES.width,
          BAR_PROPERTIES.height
        )
        ctx.fill()
        setBarPosition(initialBarPosition)
      }
    }
  }, [])

  useEffect(() => {
    if (gameRef.current) {
      const ctx = gameRef.current.getContext('2d')
      if (ctx) {
        clearFrame(ctx)

        ctx.beginPath()
        ctx.fillStyle = '#000'
        ctx.rect(
          barPosition.posX,
          barPosition.posY,
          BAR_PROPERTIES.width,
          BAR_PROPERTIES.height
        )
        ctx.fill()
      }
    }
  }, [barPosition])

  return (
    <Container backgroundColor={theme.background}>
      <FaceDetect height={200}>
        <Video ref={videoRef} />
        <Filter ref={canvasRef} />
      </FaceDetect>
      <Content padding={PADDING}>
        <canvas
          ref={gameRef}
          style={{
            backgroundColor: '#f2f2f2',
            borderRadius: 10,
            justifySelf: 'center',
            alignSelf: 'center',
          }}
        ></canvas>
      </Content>
      <Sidebar
        startGame={() => {
          startRef.current = true
        }}
        pauseGame={() => {
          startRef.current = false
        }}
      />
    </Container>
  )
}

export default App
