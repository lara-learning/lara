import React, { JSX } from 'react'
import styled from 'styled-components'
import { FontSizes } from './font-size'

import { Spacings } from './spacing'

const ApplicationsSettingsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${Spacings.l};
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const NotificationsWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: ${Spacings.l};
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: 3;
`

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SettingCaption = styled.span`
  font-size: ${FontSizes.copy};
  color: ${(props) => props.theme.mediumFont};
`

interface ApplicationSettingsLayoutProps {
  languageSettings: JSX.Element
  themeSettings: JSX.Element
  notificationsSettings: JSX.Element
  otherSettingsLabel: JSX.Element
}

export const ApplicationSettingsLayout: React.FC<ApplicationSettingsLayoutProps> = ({
  languageSettings,
  themeSettings,
  notificationsSettings,
  otherSettingsLabel,
}) => (
  <ApplicationsSettingsGrid>
    <div>{languageSettings}</div>
    <div>{themeSettings}</div>
    <NotificationsWrapper>
      <SettingCaption>{otherSettingsLabel}</SettingCaption>
      <CheckboxWrapper>{notificationsSettings}</CheckboxWrapper>
    </NotificationsWrapper>
  </ApplicationsSettingsGrid>
)
