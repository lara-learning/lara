import React from 'react'
import { Redirect, useHistory, useLocation } from 'react-router'

import { H1 } from '@lara/components'

import { PrimaryButton } from '../components/button'
import { useCreateOAuthCodeMutation } from '../graphql'
import { Template } from '../templates/template'
import { useToastContext } from '../hooks/use-toast-context'

type OAuthParams = {
  state?: string
  redirectUri?: string
}

export const OAuthPage: React.FC = () => {
  const history = useHistory()
  const { search } = useLocation<OAuthParams>()
  const params = new URLSearchParams(search)

  const toast = useToastContext()

  const [mutate, { loading }] = useCreateOAuthCodeMutation()

  const state = params.get('state')
  const redirectUri = params.get('redirect_uri')

  const authorize = () => {
    mutate().then(({ data }) => {
      if (!data?.createOAuthCode) {
        toast.addToast({ text: 'Es konnte keine Autorisierung durchgeführt werden', type: 'error' })
        history.push('/')
        return
      }

      location.replace(`${redirectUri}?state=${state}&code=${data.createOAuthCode}`)
    })
  }

  if (!state || !redirectUri) {
    return <Redirect to="/" />
  }

  return (
    <Template type="Secondary">
      <H1>Autorisiere dich für die OAuth Anwendung</H1>
      <PrimaryButton disabled={loading} onClick={authorize}>
        Autorisierung
      </PrimaryButton>
    </Template>
  )
}
