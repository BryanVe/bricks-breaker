import { forwardRef } from 'react'
import { StyledCanvas } from './style'

interface FilterProps {
  width: number
  height: number
  images: StringToStringMap
  imageKey?: string
}

const Filter = forwardRef<HTMLCanvasElement, FilterProps>((props, ref) => {
  const { width, height, imageKey, images } = props

  return (
    <div
      style={{
        position: 'relative',
        // width: '100%',
        borderRadius: '10px',
        backgroundColor: '#000',
      }}
    >
      {imageKey && (
        <img
          alt={imageKey}
          src={images[imageKey]}
          style={{
            position: 'absolute',
            left: 0,
            height: '100%',
            width: '100%',
            borderRadius: '10px',
            aspectRatio: '16 / 9',
          }}
        />
      )}
      <StyledCanvas ref={ref} />
    </div>
  )
})

export default Filter
