import { useState } from 'react'

import { Report, usePrintDataLazyQuery } from '../graphql'
import strings from '../locales/localization'
import { useToastContext } from './use-toast-context'

type UseFetchPdfPayload = [(reports: Pick<Report, 'id'>[]) => void, boolean]

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
