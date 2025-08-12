import React, { JSX, ReactNode } from 'react'
import styled from 'styled-components'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

const DayInputContainer = styled.div<{ showEntriesInput: boolean }>`
  padding-bottom: ${(props) => (props.showEntriesInput ? Spacings.xs : Spacings.l)};
  padding-top: ${Spacings.l};
`

const DayInputHeaderContainer = styled.div`
  padding: 0 ${Spacings.l};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const DayStatusContainer = styled.div`
  padding: 0 ${Spacings.l};
  display: flex;
  justify-content: space-between;
`

const StatusContainer = styled.div<{ visible: boolean }>`
  display: flex;
  align-items: center;
  transition: opacity 0.5s ease;
  opacity: ${({ visible }) => (visible ? '1' : 0)};
`

const TotalContainer = styled.div`
  padding: ${Spacings.m} 0;
  text-align: right;
`

export const StyledStatusLabel = styled.span<{ error: boolean }>`
  font-size: ${FontSizes.label};
  letter-spacing: 1.2px;
  color: ${(props) => (props.error ? props.theme.errorRed : props.theme.mediumFont)};
`

interface DayInputLayoutInterface {
  showEntriesInput: boolean
  inputHeader: JSX.Element
  statusVisibility: boolean
  icon: JSX.Element
  statusLabel: JSX.Element
  total?: JSX.Element
  commentsection?: JSX.Element
  children: ReactNode
}

export const DayInputLayout: React.FC<DayInputLayoutInterface> = ({
  showEntriesInput,
  inputHeader,
  statusVisibility,
  icon,
  statusLabel,
  total,
  commentsection,
  children,
}) => (
  <DayInputContainer showEntriesInput={showEntriesInput}>
    <DayInputHeaderContainer>{inputHeader}</DayInputHeaderContainer>
    {showEntriesInput && children}
    {showEntriesInput && (
      <>
        <DayStatusContainer>
          <StatusContainer visible={statusVisibility}>
            {icon}
            {statusLabel}
          </StatusContainer>
          {total && <TotalContainer>{total}</TotalContainer>}
        </DayStatusContainer>
        {commentsection}
      </>
    )}
  </DayInputContainer>
)
