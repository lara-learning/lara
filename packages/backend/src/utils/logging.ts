import { isDebug } from '../permissions'

export const log = (...msgs: string[]): void => {
  if (!isDebug()) {
    return
  }

  console.log(...msgs)
}
