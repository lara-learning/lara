import React from 'react'
import { StyledName, StyledWrapper, Flex, StyledHeaderSpan } from '@lara/components'

import { Trainee } from '../graphql'
import Avatar from './avatar'

interface TraineeSelectorProps {
  trainee: Pick<Trainee, 'id' | 'firstName' | 'lastName' | 'avatar'>
  onVariableChange: (traineeId: string) => void
}

const TraineeSelector: React.FunctionComponent<TraineeSelectorProps> = (props) => {
  const { trainee, onVariableChange } = props

  const handleClick = () => {
    onVariableChange(trainee.id)
  }

  return (
    <StyledWrapper onClick={handleClick}>
      <Flex justifyContent="center" alignItems="space-between">
        <StyledHeaderSpan>
          <Avatar size={44} image={trainee.avatar} />
          <StyledName>
            {trainee.firstName} {trainee.lastName}
          </StyledName>
        </StyledHeaderSpan>
      </Flex>
    </StyledWrapper>
  )
}

export default TraineeSelector
