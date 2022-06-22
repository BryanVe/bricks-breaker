import styled from 'styled-components'

interface ContainerProps {
  backgroundColor: string
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  background-color: ${(props) => props.backgroundColor};
  /* background-color: #f5f5f5; */
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
`

interface ContentProps {
  padding: number
}

export const Content = styled.div<ContentProps>`
  display: grid;
  align-self: center;
  justify-self: center;
`

interface FaceDetectProps {
  height: number
}

export const FaceDetect = styled.div<FaceDetectProps>`
  position: fixed;
  height: ${(props) => `${props.height}px`};
  border-radius: 10px;
  top: 32px;
  right: 32px;
`
