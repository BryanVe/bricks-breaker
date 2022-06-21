import { forwardRef } from 'react'

import { StyledCanvas } from './style'

const Filter = forwardRef<HTMLCanvasElement>((_props, ref) => (
  <StyledCanvas ref={ref} />
))

export default Filter
