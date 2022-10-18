import React from 'react'
import styled from 'styled-components'

import { Spacings } from './spacing'

const StyledContentGrid = styled.div`
  display: grid;
  grid-gap: ${Spacings.xl};
`

type EditUserContentLayoutProps = {
  user: JSX.Element
  form: JSX.Element
  relatedUsers: JSX.Element
}

export const EditUserContentLayout: React.FC<EditUserContentLayoutProps> = ({ user, form, relatedUsers }) => {
  return (
    <StyledContentGrid>
      {user}
      {form}
      {relatedUsers}
    </StyledContentGrid>
  )
}

type RelatedUsersLayoutProps = {
  label: JSX.Element
  users: JSX.Element
}

const StyledRelatedUsersContainer = styled.div`
  display: grid;
  grid-gap: ${Spacings.m};
`

const StyledRelatedUsersGrid = styled.div`
  display: grid;
  grid-gap: ${Spacings.m};
`

export const RelatedUsersLayout: React.FC<RelatedUsersLayoutProps> = ({ label, users }) => {
  return (
    <StyledRelatedUsersContainer>
      {label}
      <StyledRelatedUsersGrid>{users}</StyledRelatedUsersGrid>
    </StyledRelatedUsersContainer>
  )
}
