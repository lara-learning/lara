import { Response } from 'node-fetch'

import { log } from './logging'

/**
 * Converts a fetch response into json if status is ok
 * @param res Fetch response
 * @returns Parsed response
 */
export const parseOkJson = async <T>(res: Response): Promise<T | undefined> => {
  if (!res.ok) {
    log('Failed request: ', await res.json())
    return
  }

  return res.json()
}
