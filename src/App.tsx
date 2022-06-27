import { useRef, useEffect, useCallback, useContext, useState } from 'react'
import {
  createDetector,
  SupportedModels,
} from '@tensorflow-models/face-detection'
import { VERSION } from '@mediapipe/face_detection'

import { ready } from '@tensorflow/tfjs'

import { Container, Content, FaceDetect } from 'style'
import { Video, Filter, Controls } from 'components'
import { detectFace, STATES } from 'utils'
import { ThemeContext } from 'theme'

const FPS = 1000 / 30
const LIFES = 2
const PADDING = 16
const ASPECT_RATIO = 16 / 9
const PADDLE_PROPERTIES = {
  width: 200,
  height: 20,
  color: '#636363',
}

const BALL_PROPERTIES = {
  radius: 20,
  color: '#e32746',
  speedX: 8,
  speedY: 8,
}

// class Paddle {
//   private readonly width = 200
//   private readonly height = 20
//   private readonly color = '#000'
//   private posX = 0
//   private posY = 0
//   private canvas: HTMLCanvasElement | undefined

//   constructor(
//     canvas: HTMLCanvasElement,
//     initialPosX: number,
//     initialPosY: number
//   ) {
//     this.canvas = canvas
//     this.setPosition(initialPosX, initialPosY)
//   }

//   draw() {
//     if (this.canvas) {
//       const ctx = this.canvas.getContext('2d')

//       if (ctx) {
//         ctx.beginPath()
//         ctx.fillStyle = this.color
//         ctx.rect(this.posX, this.posY, this.width, this.height)
//         ctx.fill()
//       }
//     }
//   }

//   setPosition(posX: number, posY: number) {
//     this.posX = posX
//     this.posY = posY
//   }
// }

const App = () => {
  const { theme } = useContext(ThemeContext)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<HTMLCanvasElement | null>(null)
  const [start, setStart] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const lifes = useRef(LIFES)
  const paddlePosition = useRef({
    posX: 0,
    posY: 0,
  })
  const ballPosition = useRef({
    posX: 0,
    posY: 0,
  })
  const paddleMovement = useRef({
    state: 'STILL',
    theta: 0,
  })

  const startGame = () => setStart(true)
  const pauseGame = () => setStart(false)
  const restartGame = () => {
    lifes.current = LIFES
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

        paddleMovement.current = await detectFace({
          detector,
          canvas: canvasRef.current,
          video: videoRef.current,
        })
      }, FPS),
    []
  )

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

  // ! DRAW GAME
  useEffect(() => {
    if (gameRef.current) {
      // define board dimensions
      const width = 900
      const height = width / ASPECT_RATIO

      gameRef.current.width = width
      gameRef.current.height = height

      const ctx = gameRef.current.getContext('2d')
      if (ctx) {
        const initialPaddlePosition = {
          posX: (gameRef.current.width - PADDLE_PROPERTIES.width) / 2,
          posY: gameRef.current.height - PADDLE_PROPERTIES.height - PADDING,
        }
        const initialBallPosition = {
          posX: gameRef.current.width / 2,
          posY: initialPaddlePosition.posY - BALL_PROPERTIES.radius,
        }

        // draw paddle
        ctx.beginPath()
        ctx.fillStyle = PADDLE_PROPERTIES.color
        ctx.rect(
          initialPaddlePosition.posX,
          initialPaddlePosition.posY,
          PADDLE_PROPERTIES.width,
          PADDLE_PROPERTIES.height
        )
        ctx.fill()

        // draw ball
        ctx.beginPath()
        ctx.fillStyle = BALL_PROPERTIES.color
        ctx.arc(
          initialBallPosition.posX,
          initialBallPosition.posY,
          BALL_PROPERTIES.radius,
          0,
          2 * Math.PI
        )
        ctx.fill()

        paddlePosition.current = initialPaddlePosition
        ballPosition.current = initialBallPosition
      }
    }
  }, [])

  // ! PLAY GAME
  useEffect(() => {
    let interval: NodeJS.Timer | undefined

    if (start && !gameOver)
      interval = setInterval(() => {
        if (gameRef.current) {
          const ctx = gameRef.current.getContext('2d')

          if (ctx) {
            // ! GET CURRENT POSITION OF ELEMENTS
            // ! BAR POSITION
            const { state, theta } = paddleMovement.current

            const step = 40 * Math.sin(theta)
            switch (state) {
              case STATES.RIGHT: {
                const maxPosX = gameRef.current.width - PADDLE_PROPERTIES.width
                const nextPostX = paddlePosition.current.posX + step

                if (nextPostX >= maxPosX)
                  paddlePosition.current = {
                    ...paddlePosition.current,
                    posX: maxPosX,
                  }
                else
                  paddlePosition.current = {
                    ...paddlePosition.current,
                    posX: nextPostX,
                  }
                break
              }
              case STATES.LEFT: {
                const minPosX = 0
                const nextPostX = paddlePosition.current.posX - step

                if (nextPostX <= minPosX)
                  paddlePosition.current = {
                    ...paddlePosition.current,
                    posX: minPosX,
                  }
                else
                  paddlePosition.current = {
                    ...paddlePosition.current,
                    posX: nextPostX,
                  }
                break
              }
              default:
                break
            }

            // ! BALL POSITION
            ballPosition.current = {
              ...ballPosition.current,
              posX: ballPosition.current.posX - BALL_PROPERTIES.speedX,
              posY: ballPosition.current.posY - BALL_PROPERTIES.speedY,
            }

            const gameTop = 0
            const gameBottom = gameRef.current.height
            const gameLeft = 0
            const gameRight = gameRef.current.width

            const paddleTop = paddlePosition.current.posY
            // const paddleBottom = paddleTop + PADDLE_PROPERTIES.height
            const paddleLeft = paddlePosition.current.posX
            const paddleRight = paddleLeft + PADDLE_PROPERTIES.width

            const ballTop = ballPosition.current.posY - BALL_PROPERTIES.radius
            const ballBottom =
              ballPosition.current.posY + BALL_PROPERTIES.radius
            const ballLeft = ballPosition.current.posX - BALL_PROPERTIES.radius
            const ballRight = ballPosition.current.posX + BALL_PROPERTIES.radius
            if (ballBottom > gameBottom - PADDING) {
              lifes.current--

              //  else {
              const initialPaddlePosition = {
                posX: (gameRef.current.width - PADDLE_PROPERTIES.width) / 2,
                posY:
                  gameRef.current.height - PADDLE_PROPERTIES.height - PADDING,
              }
              const initialBallPosition = {
                posX: gameRef.current.width / 2,
                posY: initialPaddlePosition.posY - BALL_PROPERTIES.radius,
              }

              paddlePosition.current = initialPaddlePosition
              ballPosition.current = initialBallPosition
              // }
            }
            if (ballTop < gameTop) {
              BALL_PROPERTIES.speedY = -BALL_PROPERTIES.speedY
            }
            // ballx
            if (ballLeft < gameLeft) {
              BALL_PROPERTIES.speedX = -BALL_PROPERTIES.speedX
            } else if (ballRight > gameRight) {
              BALL_PROPERTIES.speedX = -BALL_PROPERTIES.speedX
            }

            if (
              ballBottom > paddleTop &&
              ballRight > paddleLeft &&
              ballLeft < paddleRight
              // ballTop < paddleBottom
            ) {
              BALL_PROPERTIES.speedY = -BALL_PROPERTIES.speedY

              const paddleCenter = (paddleLeft + paddleRight) / 2
              const ballDistFromCenterX =
                ballPosition.current.posX - paddleCenter
              BALL_PROPERTIES.speedX = ballDistFromCenterX * 0.15
            }

            // ! DRAW ELEMENTS
            // ! CLEAR LAST FRAME
            ctx.clearRect(0, 0, gameRef.current.width, gameRef.current.height)

            if (lifes.current === 0) {
              const fontSize = 62
              const text = 'Game Over'
              ctx.font = `${fontSize}px Arial`
              ctx.fillStyle = '#000'
              ctx.textAlign = 'center'
              ctx.fillText(
                text,
                gameRef.current.width / 2,
                gameRef.current.height / 2
              )

              setGameOver(true)
            }

            const fontSize = 32
            const text = `Lifes: ${lifes.current}`
            ctx.font = `${fontSize}px Arial`
            ctx.fillStyle = '#000'
            ctx.textAlign = 'center'
            const { width } = ctx.measureText(text)
            ctx.fillText(text, width / 2 + PADDING, fontSize + PADDING)

            // ! START NEW FRAME
            // ! DRAW BAR
            ctx.beginPath()
            ctx.fillStyle = PADDLE_PROPERTIES.color
            ctx.rect(
              paddlePosition.current.posX,
              paddlePosition.current.posY,
              PADDLE_PROPERTIES.width,
              PADDLE_PROPERTIES.height
            )
            ctx.fill()

            // ! DRAW BALL
            ctx.beginPath()
            ctx.fillStyle = BALL_PROPERTIES.color
            ctx.arc(
              ballPosition.current.posX,
              ballPosition.current.posY,
              BALL_PROPERTIES.radius,
              0,
              2 * Math.PI
            )
            ctx.fill()
          }
        }
      }, FPS)

    return () => clearInterval(interval)
  }, [start, gameOver])

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
