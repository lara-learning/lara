import React from 'react'
import styled from 'styled-components'

import { Spacings } from './spacing'

const StyledFormContainer = styled.div`
  display: grid;
  grid-gap: ${Spacings.xl};
`

const StyledFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${Spacings.l};
`

const StyledFormGridItem = styled.div`
  display: grid;
  grid-gap: ${Spacings.xxs};
`

const StyledFormGridDateItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  grid-gap: ${Spacings.s};
`

const StyledButtonControls = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${Spacings.l};
  justify-self: end;
`

type TraineeFormLayoutProps = {
  firstNameInput: JSX.Element
  lastNameInput: JSX.Element
  emailInput: JSX.Element
  companyInput: JSX.Element
  startDateInput: JSX.Element
  endDateInput: JSX.Element
  startOfToolUsageInput: JSX.Element
  course: JSX.Element
  periodSpacer: JSX.Element
  buttonControls?: JSX.Element
}

export const TraineeFormLayout: React.FC<TraineeFormLayoutProps> = ({
  firstNameInput,
  lastNameInput,
  emailInput,
  companyInput,
  startDateInput,
  endDateInput,
  startOfToolUsageInput,
  course,
  periodSpacer,
  buttonControls,
}) => {
  return (
    <StyledFormContainer>
      <StyledFormGrid>
        <StyledFormGridItem>{firstNameInput}</StyledFormGridItem>

        <StyledFormGridItem>{lastNameInput}</StyledFormGridItem>

        <StyledFormGridItem>{emailInput}</StyledFormGridItem>

        <StyledFormGridItem>{companyInput}</StyledFormGridItem>

        <StyledFormGridDateItem>
          <StyledFormGridItem>{startDateInput}</StyledFormGridItem>
          {periodSpacer}
          <div>{endDateInput}</div>
        </StyledFormGridDateItem>

        <StyledFormGridItem>{startOfToolUsageInput}</StyledFormGridItem>

        <StyledFormGridItem>{course}</StyledFormGridItem>
      </StyledFormGrid>

      {buttonControls && <StyledButtonControls>{buttonControls}</StyledButtonControls>}
    </StyledFormContainer>
  )
}

type TrainerFormLayoutProps = {
  firstNameInput: JSX.Element
  lastNameInput: JSX.Element
  emailInput: JSX.Element
  buttonControls?: JSX.Element
}

export const TrainerFormLayout: React.FC<TrainerFormLayoutProps> = ({
  firstNameInput,
  lastNameInput,
  emailInput,
  buttonControls,
}) => {
  return (
    <StyledFormContainer>
      <StyledFormGrid>
        <StyledFormGridItem>{firstNameInput}</StyledFormGridItem>

        <StyledFormGridItem>{lastNameInput}</StyledFormGridItem>

        <StyledFormGridItem>{emailInput}</StyledFormGridItem>
      </StyledFormGrid>

      {buttonControls && <StyledButtonControls>{buttonControls}</StyledButtonControls>}
    </StyledFormContainer>
  )
}

type MentorFormLayoutProps = {
  firstNameInput: JSX.Element
  lastNameInput: JSX.Element
  emailInput: JSX.Element
  startDateInput: JSX.Element
  endDateInput: JSX.Element
  periodSpacer: JSX.Element
  buttonControls?: JSX.Element
}
export const MentorFormLayout: React.FC<MentorFormLayoutProps> = ({
  firstNameInput,
  lastNameInput,
  emailInput,
  startDateInput,
  endDateInput,
  periodSpacer,
  buttonControls,
}) => {
  return (
    <StyledFormContainer>
      <StyledFormGrid>
        <StyledFormGridItem>{firstNameInput}</StyledFormGridItem>

        <StyledFormGridItem>{lastNameInput}</StyledFormGridItem>

        <StyledFormGridItem>{emailInput}</StyledFormGridItem>

        <StyledFormGridDateItem>
          <StyledFormGridItem>{startDateInput}</StyledFormGridItem>
          {periodSpacer}
          <div>{endDateInput}</div>
        </StyledFormGridDateItem>
      </StyledFormGrid>

      {buttonControls && <StyledButtonControls>{buttonControls}</StyledButtonControls>}
    </StyledFormContainer>
  )
}
