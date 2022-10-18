import { PrintEntry } from '@lara/api'

export const minutesToString = (minutes: number): string => {
  const rest = minutes % 60
  const hours = (minutes - rest) / 60
  return `${hours}:${rest < 10 ? `0${rest}` : rest}`
}

export const entriesTotal = (entries: PrintEntry[]): number => {
  return entries.reduce((acc, entry) => acc + entry.time, 0)
}
