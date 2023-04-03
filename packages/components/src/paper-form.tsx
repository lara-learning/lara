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

type CreateBriefingLayoutProps = {
  firstNameTraineeInput: JSX.Element
  lastNameTraineeInput: JSX.Element
  emailTraineeInput: JSX.Element
  firstNameMentorInput: JSX.Element
  lastNameMentorInput: JSX.Element
  emailMentorInput: JSX.Element
  customerInput: JSX.Element
 // companyInput: JSX.Element
  startDateProjectInput: JSX.Element
  endDateProjectInput: JSX.Element
  startDateSchoolInput: JSX.Element
  endDateSchoolInput: JSX.Element
  departmentInput: JSX.Element
  periodProjectSpacer: JSX.Element
  periodSchoolSpacer: JSX.Element
  buttonControls?: JSX.Element
}
export const CreateBriefingLayout: React.FC<CreateBriefingLayoutProps> = ({
  firstNameTraineeInput,
  lastNameTraineeInput,
  emailTraineeInput,
  firstNameMentorInput,
  lastNameMentorInput,
  emailMentorInput,
  customerInput,
  //companyInput,
  startDateProjectInput,
  endDateProjectInput,
  startDateSchoolInput,
  endDateSchoolInput,
  departmentInput,
  periodProjectSpacer,
  periodSchoolSpacer,
  buttonControls,
}) => {
  return (
    <StyledFormContainer>
      <StyledFormGrid>
        <StyledFormGridItem>{firstNameTraineeInput}</StyledFormGridItem>

        <StyledFormGridItem>{lastNameTraineeInput}</StyledFormGridItem>

        <StyledFormGridItem>{emailTraineeInput}</StyledFormGridItem>

        <StyledFormGridItem>{firstNameMentorInput}</StyledFormGridItem>

        <StyledFormGridItem>{lastNameMentorInput}</StyledFormGridItem>

        <StyledFormGridItem>{emailMentorInput}</StyledFormGridItem>

        <StyledFormGridItem>{customerInput}</StyledFormGridItem>

        <StyledFormGridDateItem>
          <StyledFormGridItem>{startDateProjectInput}</StyledFormGridItem>
          {periodProjectSpacer}
          <div>{endDateProjectInput}</div>
        </StyledFormGridDateItem>

        <StyledFormGridItem>{departmentInput}</StyledFormGridItem>

        <StyledFormGridDateItem>
          <StyledFormGridItem>{startDateSchoolInput}</StyledFormGridItem>
          {periodSchoolSpacer}
          <div>{endDateSchoolInput}</div>
        </StyledFormGridDateItem>

      </StyledFormGrid>

      {buttonControls && <StyledButtonControls>{buttonControls}</StyledButtonControls>}
    </StyledFormContainer>
  )
}
