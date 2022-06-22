import { FC, useContext } from 'react'

import { StyledFAIcon } from './style'
import { ThemeContext } from 'theme'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

interface HeaderProps {
  startGame: () => void
  pauseGame: () => void
}

const Header: FC<HeaderProps> = (props) => {
  const { startGame, pauseGame } = props
  const { theme, switchTheme } = useContext(ThemeContext)

  return (
    <div
      style={{
        backgroundColor: theme.sidebar,
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 16,
      }}
    >
      <StyledFAIcon
        onClick={pauseGame}
        icon={faPause}
        color={theme.icon.color}
        background={theme.icon.background.hover}
      />
      <StyledFAIcon
        onClick={startGame}
        icon={faPlay}
        color={theme.icon.color}
        background={theme.icon.background.hover}
      />
      <StyledFAIcon
        onClick={switchTheme}
        icon={theme.icon.svg}
        color={theme.icon.color}
        background={theme.icon.background.hover}
      />
    </div>
  )
}

export default Header
