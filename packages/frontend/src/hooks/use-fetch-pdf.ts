import { useState } from 'react'

import { Report, usePrintDataLazyQuery, usePrintPaperDataLazyQuery } from '../graphql'
import strings from '../locales/localization'
import { useToastContext } from './use-toast-context'
import { Paper } from '@lara/api'

type UseFetchPdfPayload = [(reports: Pick<Report, 'id'>[]) => void, boolean]
type UseFetchPaperPdfPayload = [(paper: Pick<Paper, 'id'>) => void, boolean]

export const useFetchPdf = (): UseFetchPdfPayload => {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToastContext()

  const [fetchPrintData] = usePrintDataLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: async ({ print }) => {
      const text = strings.formatString(strings.archivePage.export, print.estimatedWaitingTime) as string
      addToast({ icon: 'Export', title: strings.archivePage.exportTitle, text, type: 'success' })

      setLoading(false)
    },
  })

  return [
    (reports) => {
      setLoading(true)

      fetchPrintData({ variables: { ids: reports.map(({ id }) => id) } })
    },
    loading,
  ]
}
export const useFetchPaperPdf = (): UseFetchPaperPdfPayload => {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToastContext()
  const [fetchPrintPaperData] = usePrintPaperDataLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: async ({ printPaper }) => {
      const text = strings.formatString(strings.archivePage.export, printPaper.estimatedWaitingTime) as string
      addToast({ icon: 'Export', title: strings.archivePage.exportTitle, text, type: 'success' })

      setLoading(false)
    },
  })

  return [
    (paper) => {
      setLoading(true)
      fetchPrintPaperData({ variables: { ids: [paper.id] } }).catch((error) => {
        console.log(error)
      })
    },
    loading,
  ]
}
