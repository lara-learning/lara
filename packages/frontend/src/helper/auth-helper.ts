import { addSeconds, isFuture } from 'date-fns'

export type OAuthData = {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

export const isOAuthData = (value: unknown): value is OAuthData => {
  if (typeof value !== 'object' || value === null || !('accessToken' in value) || !('expiresIn' in value)) {
    return false
  }

  return (
    typeof value.accessToken === 'string' &&
    typeof value.expiresIn === 'number' &&
    (!('refreshToken' in value) || typeof value.refreshToken === 'string')
  )
}

const storage = localStorage

const accessTokenKey = 'access-token'
const expiresDateKey = 'access-token-expires'

export const saveOAuthData = ({ accessToken, expiresIn, refreshToken }: OAuthData): void => {
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
