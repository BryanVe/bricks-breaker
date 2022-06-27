import { FC, useContext } from 'react'

import { StyledFAIcon } from './style'
import { ThemeContext } from 'theme'
import { faPlay, faPause, faRotate } from '@fortawesome/free-solid-svg-icons'

interface ControlsProps {
  start: boolean
  gameOver: boolean
  startGame: () => void
  pauseGame: () => void
  restartGame: () => void
}

const Controls: FC<ControlsProps> = (props) => {
  const { start, gameOver, startGame, pauseGame, restartGame } = props
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
      {gameOver ? (
        <StyledFAIcon
          onClick={restartGame}
          icon={faRotate}
          color={theme.icon.color}
          background={theme.icon.background.hover}
        />
      ) : start ? (
        <StyledFAIcon
          onClick={pauseGame}
          icon={faPause}
          color={theme.icon.color}
          background={theme.icon.background.hover}
        />
      ) : (
        <StyledFAIcon
          onClick={startGame}
          icon={faPlay}
          color={theme.icon.color}
          background={theme.icon.background.hover}
        />
      )}
      <StyledFAIcon
        onClick={switchTheme}
        icon={theme.icon.svg}
        color={theme.icon.color}
        background={theme.icon.background.hover}
      />
    </div>
  )
}

export default Controls
