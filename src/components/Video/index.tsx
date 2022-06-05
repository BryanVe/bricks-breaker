import { forwardRef } from 'react'

interface VideoProps {}

const Video = forwardRef<HTMLVideoElement, VideoProps>((props, ref) => (
  <video
    ref={ref}
    autoPlay
    style={{
      width: '100%',
      height: '100%',
      aspectRatio: '16 /  9',
      borderRadius: 10,
    }}
  />
))

export default Video
