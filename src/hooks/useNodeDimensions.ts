import { useState, useEffect, useRef, useCallback } from 'react'

const useNodeDimensions = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })
  const getDimensions = useCallback(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()

      setDimensions({
        width,
        height,
      })
    }
  }, [])

  useEffect(() => {
    getDimensions()
    window.addEventListener('resize', getDimensions)

    return () => window.removeEventListener('resize', getDimensions)
  }, [getDimensions])

  return { ref, dimensions }
}

export default useNodeDimensions
