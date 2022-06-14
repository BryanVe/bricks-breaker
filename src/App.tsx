import { useRef, useEffect, useCallback, useContext } from 'react'
import { load } from '@tensorflow-models/body-pix'
import '@tensorflow/tfjs-backend-webgl'

import { Container, Content } from 'style'
import { Video, Filter, Sidebar } from 'components'
import { segmentVideo } from 'utils'
import { ThemeContext } from 'theme'

const FPS = 1000 / 30
const PADDING = 32
const ASPECT_RATIO = 16 / 9

const App = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useContext(ThemeContext)

  const loopVideo = useCallback<LoopVideo>(async (args) => {
    const { video, fps } = args

    if (video.paused || video.ended) return

    segmentVideo(args)
    setTimeout(() => loopVideo(args), fps)
  }, [])

  const captureVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: {
            exact: ASPECT_RATIO,
          },
        },
      })

      if (!videoRef.current) throw new Error('Video could not be captured')

      const { width, height } = videoRef.current.getBoundingClientRect()
      videoRef.current.srcObject = stream
      videoRef.current.width = width
      videoRef.current.height = height
    } catch (error) {
      console.log(error)
    }
  }, [videoRef])

  const runBodyPix = useCallback(async () => {
    try {
      if (!videoRef.current) throw new Error('Video could not be captured')

      const net = await load()

      videoRef.current.addEventListener(
        'play',
        () => {
          if (!canvasRef.current || !videoRef.current) return

          loopVideo({
            net,
            video: videoRef.current,
            canvas: canvasRef.current,
            fps: FPS,
          })
        },
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
    runBodyPix()
  }, [runBodyPix])

  return (
    <Container backgroundColor={theme.background}>
      <Sidebar />
      <Content padding={PADDING}>
        <Video ref={videoRef} />
        <Filter ref={canvasRef} />
      </Content>
    </Container>
  )
}

export default App
