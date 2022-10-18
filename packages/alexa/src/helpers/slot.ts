import { getSlotValue } from 'ask-sdk-core'
import { RequestEnvelope, Slot } from 'ask-sdk-model'

export const getSlotValues = <T extends string>(
  requestEnvelope: RequestEnvelope,
  ...slotNames: T[]
): Record<T, string | undefined> => {
  return slotNames.reduce((acc, name) => {
    const value = getSlotValue(requestEnvelope, name)

    if (value === '?') {
      return acc
    }

    return { ...acc, [name]: value }
  }, {} as Record<T, string | undefined>)
}

export const getSlotId = (slot?: Slot): string | undefined =>
  slot?.resolutions?.resolutionsPerAuthority?.[0].values[0].value.id
