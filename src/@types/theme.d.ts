type IconDefinition =
  import('@fortawesome/free-regular-svg-icons').IconDefinition
type ThemeKey = 'LIGHT' | 'DARK'

interface ThemeValue {
  icon: {
    svg: IconDefinition
    color: string
    background: {
      hover: string
    }
  }
  background: string
  sidebar: string
  outline: string
}

type Themes = {
  [key in ThemeKey]: ThemeValue
}
