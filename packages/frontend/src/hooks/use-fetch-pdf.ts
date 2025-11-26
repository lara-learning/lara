import { useState } from 'react'

import {
  Paper,
  Report,
  useCurrentUserLazyQuery,
  usePrintDataLazyQuery,
  usePrintPaperDataLazyQuery,
  UserTypeEnum,
} from '../graphql'
import strings from '../locales/localization'
import { useToastContext } from './use-toast-context'

type UseFetchPdfPayload = [(reports: Pick<Report, 'id'>[]) => void, boolean]
type UseFetchPaperPdfPayload = [(paper: Pick<Paper, 'id'>) => Promise<string | undefined>, boolean]

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
  const [fetchCurrentUser] = useCurrentUserLazyQuery()
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
    async (paper) => {
      setLoading(true)
      const v = await fetchCurrentUser()
      const userData = v.data
      try {
        const data = await fetchPrintPaperData({
          variables: { ids: [paper.id], userType: userData?.currentUser?.type ?? UserTypeEnum.Trainee },
        })

        return data.data?.printPaper.pdfUrl
      } catch (error) {
        console.log(error)
        return undefined
      }
    },
    loading,
  ]
}
