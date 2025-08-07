import { log } from './logging'

/**
 * Converts a fetch response into json if status is ok
 * @param res Fetch response
 * @returns Parsed response
 */
export const parseOkJson = async <T>(res: Response): Promise<T | undefined> => {
  if (!res.ok) {
    const errorData = await res.json()
    log('Failed request: ', JSON.stringify(errorData))
    return
  }
  return res.json() as T
}
