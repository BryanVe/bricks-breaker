import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  background-color: #1f1f1f;
  /* background-color: #f5f5f5; */
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
`

interface ContentProps {
  padding: number
}

export const Content = styled.div<ContentProps>`
  align-self: center;
  justify-self: center;
  width: ${(props) => `calc(100% - ${props.padding * 2}px)`};
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  align-content: center;
  gap: ${(props) => `${props.padding}px`};

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    /* grid-template-rows: repeat(2, auto); */
  }
`
