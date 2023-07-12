import { Flex } from '@rebass/grid'
import React from 'react'
import styled from 'styled-components'
import { Spacings } from './spacing'

const StyledFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding-bottom: ${Spacings.l};
`
const StyledItem = styled.div`
  display: flex;
  width: 100%;
  column-gap: ${Spacings.l};
  padding-bottom: ${Spacings.l};
  justify-content: space-between;
`

type TimetableEntryFormLayoutProps = {
  weekdayInput: JSX.Element
  timePeriodInput: JSX.Element
  subjectInput: JSX.Element
  teacherInput: JSX.Element
  roomInput: JSX.Element
  notesInput: JSX.Element
  buttons: JSX.Element
  onSubmit?: () => void
}

export const TimetableEntryFormLayout: React.FC<TimetableEntryFormLayoutProps> = ({
  weekdayInput,
  timePeriodInput,
  subjectInput,
  teacherInput,
  roomInput,
  notesInput,
  buttons,
  onSubmit,
}) => {
  return (
    <StyledFormContainer onSubmit={onSubmit}>
      <StyledItem>
        <Flex flexDirection="column">{weekdayInput}</Flex>
        <Flex flexDirection="column">{timePeriodInput}</Flex>
      </StyledItem>
      <StyledItem>{subjectInput}</StyledItem>
      <StyledItem>
        {teacherInput}
        {roomInput}
      </StyledItem>
      <StyledItem>{notesInput}</StyledItem>
      {buttons}
    </StyledFormContainer>
  )
}
