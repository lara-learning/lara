import React from 'react'
import styled from 'styled-components'

import { FontSizes } from './font-size'
import { Spacings } from './spacing'
import { Text } from './text'

type UserInfoLayoutProps = {
  avatar: JSX.Element
  name: string
  secondary: boolean
  forDeletion: boolean
  marking: string
}

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledName = styled.span<{ secondary: boolean }>`
  font-size: ${FontSizes.h2};
  font-weight: 700;
  color: ${(props) => (props.secondary ? props.theme.mediumFont : props.theme.darkFont)};
  margin-right: ${Spacings.l};
  margin-left: ${Spacings.l};
  letter-spacing: 0.9px;
`

export const UserInfoLayout: React.FC<UserInfoLayoutProps> = ({ avatar, name, secondary, forDeletion, marking }) => {
  return (
    <StyledContainer>
      {avatar}
      <StyledName secondary={secondary}>{name}</StyledName>
      {forDeletion && (
        <Text uppercase color="secondaryDefault" background="errorRed" weight={600}>
          {marking}
        </Text>
      )}
    </StyledContainer>
  )
}
