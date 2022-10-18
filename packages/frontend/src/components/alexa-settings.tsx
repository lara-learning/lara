import React, { useState } from 'react'

import { AlexaSettingsLayout, H2, Paragraph, Spacings } from '@lara/components'

import { Trainee, useAlexaLinkingUrlLazyQuery, useUnlinkAlexaMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { PrimaryButton, SecondaryButton } from './button'

interface AlexaSettingsProps {
  user: Pick<Trainee, 'id' | 'alexaSkillLinked'>
}

export const AlexaSettings: React.FC<AlexaSettingsProps> = ({ user }) => {
  const toast = useToastContext()

  const [navigating, setNavigating] = useState(false)

  const [query, { loading: urlLoading }] = useAlexaLinkingUrlLazyQuery({
    onCompleted: ({ alexaLinkingUrl }) => {
      if (!alexaLinkingUrl) {
        return
      }

      setNavigating(true)
      window.location.replace(alexaLinkingUrl)
    },
  })
  const [unlink, { loading }] = useUnlinkAlexaMutation()

  const unlinkAlexa = () =>
    unlink()
      .then(() => toast.addToast({ text: strings.settings.alexa.unlinkSuccess, type: 'success' }))
      .catch(() => toast.addToast({ text: strings.settings.alexa.unlinkError, type: 'error' }))

  const linkingLoading = urlLoading || navigating

  return (
    <AlexaSettingsLayout
      headline={
        <H2 noMargin>
          {user.alexaSkillLinked ? strings.settings.alexa.unlinkTitle : strings.settings.alexa.linkTitle}
        </H2>
      }
      body={
        user.alexaSkillLinked ? (
          <>
            <Paragraph color="darkFont">{strings.settings.alexa.unlinkInstructions}</Paragraph>
            <SecondaryButton danger icon={loading ? 'Loader' : 'Trash'} disabled={loading} onClick={unlinkAlexa}>
              {strings.settings.alexa.unlinkButton}
            </SecondaryButton>
          </>
        ) : (
          <>
            <Paragraph margin={`${Spacings.s}`} color="darkFont">
              {strings.settings.alexa.linkInstructions}
            </Paragraph>
            <PrimaryButton disabled={linkingLoading} icon={linkingLoading ? 'Loader' : 'Alexa'} onClick={() => query()}>
              {strings.settings.alexa.linkButton}
            </PrimaryButton>
          </>
        )
      }
    />
  )
}
