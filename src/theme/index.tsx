import { FC, createContext, ReactNode, useState } from 'react'
import { themes } from 'utils'

interface ThemeProviderProps {
  children: ReactNode
}

interface ThemeContextValue {
  theme: ThemeValue
  switchTheme: () => void
}

const defaultThemeKey: ThemeKey = 'DARK'

export const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.DARK,
  switchTheme: () => {},
})

export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children } = props
  const [themeKey, setThemeKey] = useState<ThemeKey>(defaultThemeKey)

  const switchTheme = () => setThemeKey(themeKey === 'LIGHT' ? 'DARK' : 'LIGHT')

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeKey],
        switchTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
