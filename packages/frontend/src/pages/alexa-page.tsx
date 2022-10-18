import React from 'react'
import { Redirect, useLocation, useHistory } from 'react-router'

import { H1 } from '@lara/components'

import { useLinkAlexaMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { PrimaryButton } from '../components/button'

type AlexaPageParams = {
  code?: string
  scope?: string
  state?: string
}

export const AlexaPage: React.FC = () => {
  const history = useHistory()

  const { search } = useLocation<AlexaPageParams>()
  const params = new URLSearchParams(search)

  const toast = useToastContext()

  const code = params.get('code')
  const state = params.get('state')

  const [mutate, { loading }] = useLinkAlexaMutation()

  const handleLinkSuccess = () => {
    history.push('/settings')
    toast.addToast({ text: strings.settings.alexa.linkSuccess, type: 'success' })
  }

  const handleLinkError = () => {
    history.push('/')
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
    return <Redirect to="" />
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
