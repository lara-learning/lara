import React from 'react'

export const useSystemColorScheme = (): boolean => {
  const [darkMode, setDarkMode] = React.useState(window.matchMedia('(prefers-color-scheme: dark)').matches)

  const updateDarkMode = (event: MediaQueryListEvent) => {
    setDarkMode(event.matches)
  }

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

    mediaQueryList.addEventListener('change', updateDarkMode)

    return () => mediaQueryList.removeEventListener('change', updateDarkMode)
  })

  return darkMode
}
