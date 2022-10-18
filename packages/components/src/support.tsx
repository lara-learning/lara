import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Container } from './container'
import { IconName, StyledIcon } from './icons'
import { Spacings } from './spacing'

export const StyledSupportHeader = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${Spacings.xxl};
`

export const StyledSupportExternalLink = styled.a`
  text-decoration: none;
`

export const StyledSupportLink = styled(Link)`
  text-decoration: none;
`

const StyledSupportContainer = styled(Container)`
  padding: ${Spacings.xl};
  position: relative;
  cursor: pointer;
`

const StyledSupportTileTitle = styled.div`
  margin-bottom: ${Spacings.m};
  font-weight: bold;
`

const StyledSupportTileIcon = styled(StyledIcon)`
  position: absolute;
  z-index: 0;
  top: ${Spacings.m};
  left: ${Spacings.m};
`

const StyledSupportTileContent = styled.div`
  position: relative;
  z-index: 1;
`

const StyledSupportPage = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${Spacings.xxl};
  justify-items: center;
`

type StyledSupportTileProps = {
  title: JSX.Element
  body: JSX.Element
  icon: IconName
}

export const StyledSupportTile: React.FC<StyledSupportTileProps> = ({ title, body, icon }) => {
  return (
    <StyledSupportContainer hoverable>
      <StyledSupportTileIcon size="50px" name={icon} color="supportIcon" />
      <StyledSupportTileContent>
        <StyledSupportTileTitle>{title}</StyledSupportTileTitle>
        {body}
      </StyledSupportTileContent>
    </StyledSupportContainer>
  )
}

type StyledSupportLayoutProps = {
  illustration: JSX.Element
}

export const StyledSupportLayout: React.FC<StyledSupportLayoutProps> = ({ illustration, children }) => {
  return (
    <StyledSupportPage>
      <StyledSupportHeader>{children}</StyledSupportHeader>
      {illustration}
    </StyledSupportPage>
  )
}
