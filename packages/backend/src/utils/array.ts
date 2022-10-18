export const filterNullish = <T>(array: (T | undefined)[]): T[] => {
  return array.filter((item): item is T => Boolean(item))
}

export const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  const res = []

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}

export const arraySize = (array: unknown[]): number => {
  return Buffer.byteLength(JSON.stringify(array), 'utf8')
}
