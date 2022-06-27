import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons'

export const themes: Themes = {
  DARK: {
    icon: {
      svg: faSun,
      color: '#FBFEFB',
      background: {
        hover: '#132738',
      },
    },
    background: '#09141b',
    sidebar: '#0A161F',
    outline: '#FBFEFB',
  },
  LIGHT: {
    icon: {
      svg: faMoon,
      color: '#0A161F',
      background: {
        hover: '#e2e5e7',
      },
    },
    background: '#F3F5F7',
    sidebar: '#FBFEFB',
    outline: '#0A161F',
  },
}
