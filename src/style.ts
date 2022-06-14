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
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
`

interface ContentProps {
  padding: number
}

export const Content = styled.div<ContentProps>`
  align-self: center;
  justify-self: center;
  width: ${(props) => `calc(100% - ${props.padding * 2}px)`};
  max-width: 2000px;
  height: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-content: center;
  gap: ${(props) => `${props.padding}px`};

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    /* grid-template-rows: repeat(2, auto); */
  }
`
