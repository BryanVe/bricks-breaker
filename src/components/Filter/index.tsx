import { forwardRef } from 'react'

interface FilterProps {
  width: number
  height: number
}

const Filter = forwardRef<HTMLCanvasElement, FilterProps>((props, ref) => {
  const { width, height } = props

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        width: '100%',
        aspectRatio: '16 /  9',
        borderRadius: 10,
        backgroundColor: '#000',
      }}
    />
  )
})

export default Filter
