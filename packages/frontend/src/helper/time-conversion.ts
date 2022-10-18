class TimeConversion {
  public static stringToMinutes(input: string): number {
    const re = /(\d{0,2}):(\d{0,2})/
    const reFloat = /(\d{1,2})([.,])(\d{1,2})/

    const match = re.exec(input)
    const floatMatch = reFloat.exec(input)

    if (re.test(input) && match) {
      const h = parseInt(match[1], 10)
      const m = parseInt(match[2], 10)
      return h * 60 + m
    } else if (reFloat.test(input) && floatMatch) {
      const float = parseFloat(floatMatch[0].replace(',', '.'))
      return Math.round(float * 60)
    } else if (input.length === 1) {
      return parseInt(input, 10) * 60
    } else {
      return parseInt(input, 10)
    }
  }
  public static minutesToString(minutes: number): string {
    const rest = minutes % 60
    const hours = (minutes - rest) / 60
    return `${hours}:${rest < 10 ? `0${rest}` : rest}`
  }
}

export default TimeConversion
