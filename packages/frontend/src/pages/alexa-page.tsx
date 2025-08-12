import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

import { H1 } from '@lara/components'

import { useLinkAlexaMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { PrimaryButton } from '../components/button'

export const AlexaPage: React.FC = () => {
  const navigate = useNavigate()

  const { search } = useLocation()
  const params = new URLSearchParams(search)

  const toast = useToastContext()

  const code = params.get('code')
  const state = params.get('state')

  const [mutate, { loading }] = useLinkAlexaMutation()

  const handleLinkSuccess = () => {
    navigate('/settings')
    toast.addToast({ text: strings.settings.alexa.linkSuccess, type: 'success' })
  }

  const handleLinkError = () => {
    navigate('/')
    toast.addToast({ text: strings.settings.alexa.linkError, type: 'error' })
  }

  const linkAccounts = () => {
    if (!code || !state) {
      return
    }

    mutate({ variables: { code, state: state } })
      .then((res) => {
        if (!res.data?.linkAlexa?.alexaSkillLinked) {
          return handleLinkError()
        }

        handleLinkSuccess()
      })
      .catch(() => handleLinkError())
  }

  if (!code || !state) {
    return <Navigate to="" />
  }

  return (
    <Template type="Secondary">
      <H1>{loading ? strings.settings.alexa.loading : strings.settings.alexa.linkTitle}</H1>
      <PrimaryButton icon={loading ? 'Loader' : 'Alexa'} disabled={loading} onClick={linkAccounts}>
        Verbinde die Accounts
      </PrimaryButton>
    </Template>
  )
}
