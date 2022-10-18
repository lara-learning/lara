import React from 'react'

import {
  darkTheme,
  lightTheme,
  DefaultTheme,
  ThemeProvider as NativeThemeProvider,
  ModernNormalize,
} from '@lara/components'

import { useSystemColorScheme } from './hooks/use-system-color-scheme'
import { UserInterface } from './graphql'

type ThemeProviderProps = {
  currentUser?: Pick<UserInterface, 'theme'>
}

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = ({ children, currentUser }) => {
  const systemDarkModeEnabled = useSystemColorScheme()
  const [selectedTheme, setSelectedTheme] = React.useState<DefaultTheme>(lightTheme)

  if (currentUser) {
    const { theme } = currentUser

    switch (theme) {
      case 'dark':
        if (selectedTheme !== darkTheme) {
          setSelectedTheme(darkTheme)
        }
        break
      case 'light':
        if (selectedTheme !== lightTheme) {
          setSelectedTheme(lightTheme)
        }
        break
      case 'system':
      default: {
        const targetTheme = systemDarkModeEnabled ? darkTheme : lightTheme
        if (targetTheme !== selectedTheme) {
          setSelectedTheme(targetTheme)
        }
      }
    }
  }

  return (
    <NativeThemeProvider theme={selectedTheme}>
      <ModernNormalize />
      {children}
    </NativeThemeProvider>
  )
}

export default ThemeProvider
