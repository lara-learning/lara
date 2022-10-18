import { v4 } from 'uuid'
import { randomBytes } from 'crypto'

/**
 * Creates random token string
 * @returns Token string
 */
export const createRandomToken = (length = 256): Promise<string> => {
  return new Promise((res) => {
    randomBytes(length, (error, buffer) => {
      if (error) {
        res(v4())
      }

      res(buffer.toString('hex'))
    })
  })
}

export type Credentials = {
  username: string
  password: string
}

/**
 * Reads the username and password from basic auth header
 * @param header Auth header string
 * @returns Credentials
 */
export const parseBasicAuth = (header: string): Credentials => {
  const token = header.replace('Basic ', '')
  const auth = Buffer.from(token, 'base64').toString()

  const colonIndex = auth.indexOf(':')
  const username = auth.substring(0, colonIndex)
  const password = auth.substring(colonIndex + 1)

  return {
    username,
    password,
  }
}

/**
 * Reads the access token from a bearer header
 * @param header Auth header string
 * @returns Access token
 */
export const parseBearerAuth = (header: string): string => {
  return header.replace('Bearer ', '')
}
