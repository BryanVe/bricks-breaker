import { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import * as bodyPix from '@tensorflow-models/body-pix'
import '@tensorflow/tfjs-backend-webgl'

import { Video, Filter } from 'components'
import { useNodeDimensions } from 'hooks'

const padding = 32
const FPS = 1000 / 60
const aspectRatio = 16 / 9

const Container = styled.div`
  position: relative;
  background-color: #2a2a2a;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
`

const Content = styled.div`
  align-self: center;
  justify-self: center;
  width: calc(100% - ${padding * 2}px);
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  align-content: center;
  gap: ${padding}px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    /* grid-template-rows: repeat(2, auto); */
  }
`

const segmentVideo = async (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  net: bodyPix.BodyPix
) => {
  const backgroundBlurAmount = 10
  const edgeBlurAmount = 12
  const flipHorizontal = false

  const segmentation = await net.segmentPerson(video, {
    segmentationThreshold: 0.5,
  })

  bodyPix.drawBokehEffect(
    canvas,
    video,
    segmentation,
    backgroundBlurAmount,
    edgeBlurAmount,
    flipHorizontal
  )
}

const loopVideo = async (
  net: bodyPix.BodyPix,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  if (video.paused || video.ended) return

  segmentVideo(canvas, video, net)
  setTimeout(() => loopVideo(net, video, canvas), FPS)
}

const App = () => {
  const { ref: videoRef, dimensions: videoDimensions } =
    useNodeDimensions<HTMLVideoElement>()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const captureVideo = useCallback(async () => {
    if (!navigator.mediaDevices.getUserMedia)
      throw new Error('Media device could not be loaded')

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        aspectRatio: {
          exact: aspectRatio,
        },
      },
    })

    if (!videoRef.current) throw new Error('Video could not be captured')

    const { width, height } = videoRef.current.getBoundingClientRect()
    videoRef.current.srcObject = stream
    videoRef.current.width = width
    videoRef.current.height = height
  }, [videoRef])

  const runBodyPix = useCallback(async () => {
    try {
      if (!videoRef.current) throw new Error('Video could not be captured')

      const net = await bodyPix.load()

      videoRef.current.addEventListener(
        'play',
        function () {
          if (!canvasRef.current) return

          const { width, height } = this.getBoundingClientRect()
          canvasRef.current.width = width
          canvasRef.current.height = height

          loopVideo(net, this, canvasRef.current)
        },
        false
      )
    } catch (error) {
      console.log(error)
    }
  }, [videoRef])

  useEffect(() => {
    captureVideo()
  }, [captureVideo])

  useEffect(() => {
    runBodyPix()
  }, [runBodyPix])

  return (
    <Container>
      <div style={{ height: 70 }}>adasd</div>
      <Content>
        <Video ref={videoRef} />
        <Filter
          ref={canvasRef}
          width={videoDimensions.width}
          height={videoDimensions.height}
        />
      </Content>
      <div style={{ height: 150 }}>asdasd</div>
    </Container>
  )
}

export default App
