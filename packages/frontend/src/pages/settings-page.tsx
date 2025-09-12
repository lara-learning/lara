import React from 'react'

import { Container, H1, Spacer, StyledSettingsSpacer, StyledTextInputLabel } from '@lara/components'

import { AlexaSettings } from '../components/alexa-settings'
import ApplicationSettings from '../components/application-settings'
import Loader from '../components/loader'
import SignatureSettings from '../components/signature-settings'
import TraineeSettings from '../components/trainee-settings'
import { UserTypeEnum, useSettingsPageDataQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import AvatarSettings from '../components/avatar-settings'

const SettingsPage: React.FunctionComponent = () => {
  const { loading, data } = useSettingsPageDataQuery()

  return (
    <Template type="Main">
      {loading && <Loader />}

      {/* Trainee Settings */}
      {!loading && data?.currentUser && data.currentUser.type === UserTypeEnum.Trainee && (
        <Spacer bottom="xl">
          <Container>
            <Spacer xy="l">
              <Spacer bottom="l">
                <H1 noMargin>{strings.settings.apprenticeship}</H1>
              </Spacer>

              <TraineeSettings />
            </Spacer>
          </Container>
        </Spacer>
      )}

      {/* Admin Settings */}
      {!loading && data?.currentUser && (
        <Spacer bottom="xl" id="testidd">
          <Container>
            <Spacer xy="l">
              <Spacer bottom="l">
                <H1 noMargin>{strings.settings.user}</H1>
              </Spacer>

              <StyledTextInputLabel valid>{strings.settings.avatar.label}</StyledTextInputLabel>

              <StyledSettingsSpacer xy={'l'}>
                <AvatarSettings />
              </StyledSettingsSpacer>

              {data.currentUser.type !== UserTypeEnum.Admin && (
                <Spacer top="l">
                  <StyledTextInputLabel valid>{strings.settings.signature.title}</StyledTextInputLabel>

                  <StyledSettingsSpacer xy={'l'}>
                    <SignatureSettings />
                  </StyledSettingsSpacer>
                </Spacer>
              )}

              {data.currentUser.__typename === 'Trainee' && (
                <Spacer top="l">
                  <StyledTextInputLabel valid>{strings.settings.alexa.headline}</StyledTextInputLabel>

                  <StyledSettingsSpacer xy={'l'}>
                    <AlexaSettings user={data.currentUser} />
                  </StyledSettingsSpacer>
                </Spacer>
              )}
            </Spacer>
          </Container>
        </Spacer>
      )}

      {/* Application Settings */}
      {!loading && data?.currentUser && (
        <Spacer bottom="xl">
          <Container>
            <Spacer xy="l">
              <Spacer bottom="l">
                <H1 noMargin>{strings.settings.application}</H1>
              </Spacer>
              <ApplicationSettings user={data.currentUser} />
            </Spacer>
          </Container>
        </Spacer>
      )}
    </Template>
  )
}

export default SettingsPage
