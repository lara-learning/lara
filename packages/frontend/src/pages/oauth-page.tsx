import React from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router'

import { H1 } from '@lara/components'

import { PrimaryButton } from '../components/button'
import { useCreateOAuthCodeMutation } from '../graphql'
import { Template } from '../templates/template'
import { useToastContext } from '../hooks/use-toast-context'

export const OAuthPage: React.FC = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)

  const toast = useToastContext()

  const [mutate, { loading }] = useCreateOAuthCodeMutation()

  const state = params.get('state')
  const redirectUri = params.get('redirect_uri')

  const authorize = () => {
    mutate().then(({ data }) => {
      if (!data?.createOAuthCode) {
        toast.addToast({ text: 'Es konnte keine Autorisierung durchgeführt werden', type: 'error' })
        navigate('/')
        return
      }

      location.replace(`${redirectUri}?state=${state}&code=${data.createOAuthCode}`)
    })
  }

  if (!state || !redirectUri) {
    return <Navigate to="/" />
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
