import React from 'react'

import { Flex } from '@rebass/grid'

import { H1, Paragraph } from '@lara/components'
import strings from '../locales/localization'
import { PrimaryButton } from './button'

type TimetableEmptyStateType = {
  onClick: () => void
}
export const TimetableEmptyState: React.FC<TimetableEmptyStateType> = ({ onClick }) => {
  return (
    <>
      <Flex flexDirection={'column'} alignItems={'center'} mt={'3'}>
        <H1 center>{strings.timetablePage.title}</H1>
        <Paragraph center margin="24px">
          {strings.timetablePage.emptyState}
        </Paragraph>
        <PrimaryButton onClick={() => onClick()}>{strings.timetablePage.add}</PrimaryButton>
      </Flex>
    </>
  )
}
