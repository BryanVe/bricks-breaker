import styled from 'styled-components'

interface StyledCanvasProps {
  backgroundColor: string
}

export const StyledCanvas = styled.canvas<StyledCanvasProps>`
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor};
  z-index: 1000;
`
