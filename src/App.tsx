import { useRef, useEffect, useCallback, useContext, useState } from 'react'
import {
  createDetector,
  SupportedModels,
} from '@tensorflow-models/face-detection'
import { VERSION } from '@mediapipe/face_detection'
import { ready } from '@tensorflow/tfjs'

import { Container, Content, FaceDetect } from 'style'
import { Video, Filter, Controls } from 'components'
import { detectFace, Game } from 'utils'
import { ThemeContext } from 'theme'

const FPS = 45
const LIFES = 3
const PADDING = 16
const ASPECT_RATIO = 16 / 9

const App = () => {
  const { theme } = useContext(ThemeContext)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<Game>(new Game(LIFES))
  const [start, setStart] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => setStart(true)
  const pauseGame = () => setStart(false)
  const restartGame = () => {
    gameRef.current.restart(LIFES)
    setGameOver(false)
  }

  const loopVideo = useCallback<LoopVideo>(
    (detector) =>
      setInterval(async () => {
        if (
          !videoRef.current ||
          !canvasRef.current ||
          videoRef.current.paused ||
          videoRef.current.ended
        )
          return

        const { width, height } = videoRef.current.getBoundingClientRect()

        canvasRef.current.width = width
        canvasRef.current.height = height

        const { state, theta } = await detectFace({
          detector,
          canvas: canvasRef.current,
          video: videoRef.current,
        })

        gameRef.current.setPaddleMovement(state, theta)
      }, 1000 / FPS),
    []
  )

  const captureVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: {
            ideal: FPS,
          },
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
  }, [])

  const runDetector = useCallback(async () => {
    try {
      if (!videoRef.current) throw new Error('Face could not be detected')

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
        () => loopVideo(detector),
        false
      )
    } catch (error) {
      console.log(error)
    }
  }, [videoRef, loopVideo])

  // ! START CAPTURING VIDEO FROM CAMERA
  useEffect(() => {
    captureVideo()
  }, [captureVideo])

  // ! RUN FACE DETECTOR FOR GETTING MOVEMENTS
  useEffect(() => {
    runDetector()
  }, [runDetector])

  // ! DISPLAY GAME
  useEffect(() => {
    const width = 900
    const height = width / ASPECT_RATIO

    gameRef.current.setDimensions(width, height)
    gameRef.current.display()
  }, [])

  // ! START GAME
  useEffect(() => {
    let interval: NodeJS.Timer | undefined

    if (start)
      interval = setInterval(() => {
        if (gameRef.current.isFinished()) {
          gameRef.current.showResults()
          setGameOver(true)
        } else gameRef.current.play()
      }, 1000 / FPS)

    return () => clearInterval(interval)
  }, [start])

  return (
    <Container backgroundColor={theme.background}>
      <FaceDetect height={150}>
        <Video ref={videoRef} />
        <Filter ref={canvasRef} />
      </FaceDetect>
      <Content padding={PADDING}>
        <canvas
          ref={(ref) => gameRef.current.setCanvas(ref)}
          style={{
            backgroundColor: '#bbbbbb',
            borderRadius: 10,
            justifySelf: 'center',
            alignSelf: 'center',
            outline: `6px solid ${theme.outline}`,
          }}
        />
      </Content>
      <Controls
        start={start}
        gameOver={gameOver}
        startGame={startGame}
        pauseGame={pauseGame}
        restartGame={restartGame}
      />
    </Container>
  )
}

export default App
