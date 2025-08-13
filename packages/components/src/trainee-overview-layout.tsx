import React, { JSX, ReactNode } from 'react'
import styled from 'styled-components'

import { Flex } from '@rebass/grid'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'
import { WeekCardLayout } from './week-card-layout'

const TraineeReportsOverviewName = styled.span`
  font-size: ${FontSizes.copy};
  font-weight: bold;
  letter-spacing: 0.3px;
  color: ${(props) => props.theme.darkFont};
`

const TraineeReportsOverviewCaption = styled.span`
  color: ${(props) => props.theme.mediumFont};
  font-size: ${FontSizes.smallCopy};
  letter-spacing: 0.2px;
  margin-left: ${Spacings.xxs};
`

const TraineeReportsOverviewContainer = styled.div`
  margin-bottom: ${Spacings.xl};
`

const TraineeReportsOverviewHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.surface};
  border-radius: ${BorderRadii.xxs};
  padding: ${Spacings.s} ${Spacings.xs};
  margin-bottom: ${Spacings.l};
`

interface TraineeOverviewLayoutProps {
  readonly avatar: JSX.Element
  readonly name: string
  readonly icon: JSX.Element
  readonly caption: string
  readonly children: ReactNode
}

export const TraineeOverviewLayout: React.FC<TraineeOverviewLayoutProps> = ({
  avatar,
  name,
  caption,
  children,
  icon,
}) => (
  <TraineeReportsOverviewContainer>
    <TraineeReportsOverviewHeader>
      {avatar}
      <Flex flexDirection={'column'} pl={'3'}>
        <TraineeReportsOverviewName>{name}</TraineeReportsOverviewName>
        <Flex alignItems="center" mt="1">
          {icon}
          <TraineeReportsOverviewCaption>{caption}</TraineeReportsOverviewCaption>
        </Flex>
      </Flex>
    </TraineeReportsOverviewHeader>
    <WeekCardLayout>{children}</WeekCardLayout>
  </TraineeReportsOverviewContainer>
)
