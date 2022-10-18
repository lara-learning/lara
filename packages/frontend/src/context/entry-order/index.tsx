import React, { createContext, FC, useState } from 'react'
import { Entry } from '../../graphql'

export interface EntryOrderContext {
  entry?: Pick<Entry, 'id' | 'orderId'>
  dayId?: string
  targetDayId?: string
  targetOrderId?: number
  setDayId: (dayId: string) => void
  setEntry: (entry: Pick<Entry, 'id' | 'orderId'>) => void
  setTargetDayId: (dayId: string) => void
  setTargetOrderId: (orderId: number) => void
  clearState: () => void
}

export const EntryOrderContext = createContext<EntryOrderContext>({
  entry: undefined,
  dayId: undefined,
  targetDayId: undefined,
  targetOrderId: undefined,
  setDayId: () => undefined,
  setEntry: () => undefined,
  setTargetDayId: () => undefined,
  setTargetOrderId: () => undefined,
  clearState: () => undefined,
})

export const EntryOrderProvider: FC = (props) => {
  const [entry, setEntry] = useState<Pick<Entry, 'id' | 'orderId'>>()
  const [dayId, setDayId] = useState<string>()
  const [targetDayId, setTargetDayId] = useState<string>()
  const [targetOrderId, setTargetOrderId] = useState<number>()

  const clearState = () => {
    setEntry(undefined)
    setTargetDayId(undefined)
    setTargetOrderId(undefined)
  }

  return (
    <EntryOrderContext.Provider
      value={{
        dayId,
        entry,
        targetDayId,
        targetOrderId,
        setDayId,
        setTargetDayId,
        setTargetOrderId,
        setEntry,
        clearState,
      }}
    >
      {props.children}
    </EntryOrderContext.Provider>
  )
}
