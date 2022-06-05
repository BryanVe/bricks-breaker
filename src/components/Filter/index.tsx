import { forwardRef } from 'react'
import { StyledCanvas } from './style'

interface FilterProps {
  width: number
  height: number
}

const Filter = forwardRef<HTMLCanvasElement, FilterProps>((props, ref) => {
  const { width, height } = props

  return <StyledCanvas ref={ref} width={width} height={height} />
})

export default Filter
