import { useContext } from 'react'

import { StyledFAIcon } from './style'
import { ThemeContext } from 'theme'

const Header = () => {
  const { theme, switchTheme } = useContext(ThemeContext)

  return (
    <div
      style={{
        backgroundColor: theme.sidebar,
        display: 'grid',
        alignContent: 'end',
        justifyContent: 'center',
        padding: 16,
      }}
    >
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
