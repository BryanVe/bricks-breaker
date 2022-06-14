import styled from 'styled-components'

interface StyledVideoProps {
  backgroundColor: string
}

export const StyledVideo = styled.video<StyledVideoProps>`
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor};
`
