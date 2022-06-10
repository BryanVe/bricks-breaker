import { useRef, useEffect, useCallback, useState } from 'react'
import { load } from '@tensorflow-models/body-pix'
import '@tensorflow/tfjs-backend-webgl'

import { Container, Content } from 'style'
import { Video, Filter, Images } from 'components'
import { useNodeDimensions } from 'hooks'
import { segmentVideo, images } from 'utils'

const FPS = 1000 / 30
const PADDING = 32
const ASPECT_RATIO = 16 / 9

const App = () => {
  const { ref: videoRef, dimensions: videoDimensions } =
    useNodeDimensions<HTMLVideoElement>()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const selectedImageKeyRef = useRef<string>()
  const [selectedImageKey, setSelectedImageKey] = useState<string>()

  const selectImageKey = (key: string) => {
    selectedImageKeyRef.current =
      selectedImageKeyRef.current !== key ? key : undefined
    setSelectedImageKey(selectedImageKey !== key ? key : undefined)
  }

  const loopVideo = useCallback<LoopVideo>(async (args) => {
    const { video, fps } = args

    if (video.paused || video.ended) return

    const segmentVideoArgs = {
      ...args,
      selectedImageKey: selectedImageKeyRef.current,
    }

    segmentVideo(segmentVideoArgs)
    setTimeout(() => loopVideo(segmentVideoArgs), fps)
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
        function () {
          if (!canvasRef.current || !videoRef.current) return

          const { width, height } = this.getBoundingClientRect()
          canvasRef.current.width = width
          canvasRef.current.height = height

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
    <Container>
      <div
        style={{
          height: 70,
          backgroundColor: 'rgba(0,0,0,0.05)',
        }}
      >
        Dark mode switch
      </div>
      <Content padding={PADDING}>
        <Video ref={videoRef} />
        <Filter
          ref={canvasRef}
          // width={videoDimensions.width}
          // height={videoDimensions.height}
          width={600}
          height={400}
          images={images}
          imageKey={selectedImageKey}
        />
      </Content>
      <Images
        images={images}
        selectImageKey={selectImageKey}
        selectedImageKey={selectedImageKey}
      />
    </Container>
  )
}

export default App
