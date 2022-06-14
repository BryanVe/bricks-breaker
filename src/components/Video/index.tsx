import { forwardRef, useContext } from 'react'

import { ThemeContext } from 'theme'
import { StyledVideo } from './style'

const Video = forwardRef<HTMLVideoElement>((_props, ref) => {
  const { theme } = useContext(ThemeContext)

  return <StyledVideo ref={ref} autoPlay backgroundColor={theme.sidebar} />
})

export default Video
