import { format } from 'date-fns'

export const formatDateForSpeech = (date: string): string => format(new Date(date), 'yyyy-MM-dd')
