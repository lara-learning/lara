import { GraphQLError } from 'graphql'
import React from 'react'

import { ApplicationSettingsLayout, Paragraph, StyledSelect, StyledTextInputLabel } from '@lara/components'

import {
  ApplicationSettingsUpdateUserMutationVariables,
  useApplicationSettingsUpdateUserMutation,
  UserInterface,
} from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import ToggleSwitch from './toggle-switch'

export interface ApplicationSettingsProps {
  user: Pick<UserInterface, 'id' | 'language' | 'theme' | 'notification'>
}

const ApplicationSettings: React.FunctionComponent<ApplicationSettingsProps> = ({ user }) => {
  const [updateCurrentUser] = useApplicationSettingsUpdateUserMutation()
  const { addToast } = useToastContext()

  const updateLanguage = (event: React.ChangeEvent<HTMLSelectElement>) =>
    updateApplicationSettings({
      variables: {
        language: event.target.value,
      },
    })

  const updateTheme = (event: React.ChangeEvent<HTMLSelectElement>) =>
    updateApplicationSettings({
      variables: {
        theme: event.target.value,
      },
    })

  const updateNotifications = () =>
    updateApplicationSettings({
      variables: {
        notification: user.notification,
      },
    })

  const updateApplicationSettings = (payload: { variables: ApplicationSettingsUpdateUserMutationVariables }) =>
    updateCurrentUser({
      ...payload,
      optimisticResponse: {
        __typename: 'Mutation',
        updateCurrentUser: { __typename: 'Trainee', ...user, ...payload.variables },
      },
    })
      .then(() => {
        addToast({
          icon: 'Settings',
          title: strings.settings.saveSuccessTitle,
          text: strings.settings.saveSuccess,
          type: 'success',
        })
      })
      .catch((exception: GraphQLError) => {
        addToast({
          text: exception.message,
          type: 'error',
        })
      })

  return (
    <ApplicationSettingsLayout
      languageSettings={
        <>
          <StyledTextInputLabel valid>{strings.settings.language.title}</StyledTextInputLabel>
          <StyledSelect
            id="settings-language-select"
            defaultValue={user.language || navigator.language}
            onChange={updateLanguage}
          >
            <option value="en">{strings.settings.language.english}</option>
            <option value="de">{strings.settings.language.german}</option>
          </StyledSelect>
        </>
      }
      themeSettings={
        <>
          <StyledTextInputLabel valid>{strings.settings.theme.title}</StyledTextInputLabel>
          <StyledSelect id="settings-theme-select" defaultValue={user.theme || 'system'} onChange={updateTheme}>
            <option value="system">{strings.settings.theme.system}</option>
            <option value="light">{strings.settings.theme.light}</option>
            <option value="dark">{strings.settings.theme.dark}</option>
          </StyledSelect>
        </>
      }
      otherSettingsLabel={<StyledTextInputLabel valid>{strings.settings.other}</StyledTextInputLabel>}
      notificationsSettings={
        <>
          <Paragraph noMargin>{strings.settings.notification}</Paragraph>
          <ToggleSwitch checked={Boolean(user.notification)} handleClick={updateNotifications} />
        </>
      }
    />
  )
}

export default ApplicationSettings
