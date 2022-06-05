import { forwardRef } from 'react'
import { StyledVideo } from './style'

const Video = forwardRef<HTMLVideoElement>((_props, ref) => (
  <StyledVideo ref={ref} autoPlay />
))

export default Video
