import { addSeconds, isFuture } from 'date-fns'
import { OAuthPayload } from '../graphql'

const storage = localStorage

export const saveAvatar = (avatar?: string): void => {
  if (avatar) storage.setItem(avatarKey, avatar)
  else storage.removeItem(avatarKey)
}

const accessTokenKey = 'access-token'
const expiresDateKey = 'access-token-expires'
const avatarKey = 'avatar'

export const saveOAuthData = ({ accessToken, expiresIn, refreshToken }: OAuthPayload): void => {
  storage.setItem(accessTokenKey, accessToken)
  storage.setItem(expiresDateKey, addSeconds(new Date(), expiresIn).toISOString())

  if (refreshToken) {
    storage.setItem(refreshTokenKey, refreshToken)
  }
}

export const clearOAuthData = (): void => {
  storage.removeItem(accessTokenKey)
  storage.removeItem(refreshTokenKey)
  storage.removeItem(expiresDateKey)
}

export const accessTokenValid = (): boolean => {
  const expiresDateString = storage.getItem(expiresDateKey)

  if (!expiresDateString) {
    return false
  }

  const expiresDate = new Date(expiresDateString)
  return isFuture(expiresDate)
}

export const getAccessToken = (): string | undefined => storage.getItem(accessTokenKey) ?? undefined

const refreshTokenKey = 'refresh-token'

export const getRefreshToken = (): string | undefined => storage.getItem(refreshTokenKey) ?? undefined
