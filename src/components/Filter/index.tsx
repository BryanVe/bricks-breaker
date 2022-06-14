import { forwardRef, useContext } from 'react'

import { ThemeContext } from 'theme'
import { StyledCanvas } from './style'

const Filter = forwardRef<HTMLCanvasElement>((_props, ref) => {
  const { theme } = useContext(ThemeContext)

  return <StyledCanvas ref={ref} backgroundColor={theme.sidebar} />
})

export default Filter
