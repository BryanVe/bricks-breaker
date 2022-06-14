import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface StyledFAIconProps {
  background: string
}

export const StyledFAIcon = styled(FontAwesomeIcon)<StyledFAIconProps>`
  font-size: 32px;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.background};
  }
`
