import { UserInterface } from '../graphql'
import { useSystemColorScheme } from './use-system-color-scheme'

export const useIsDarkMode = (user?: Pick<UserInterface, 'theme'>): boolean => {
  const systemDarkMode = useSystemColorScheme()

  if (user?.theme) {
    return user.theme === 'dark'
  }

  return systemDarkMode
}
