import React, { useState } from 'react'

import { H1, StyledIndicator } from '@lara/components'
import { Flex } from '@rebass/grid'

import strings from '../locales/localization'
import { PrimaryButton } from './button'
import { Questions } from './timetable-questions'
import { useUpdateTraineeTimetableSettingsMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import { GraphQLError } from 'graphql'

export type TimeTableUserSettings = {
  onBoardingTimetable: boolean
  weekendSchool: boolean
  preFillClass: boolean
}

export type OnboardingContent = {
  text: string
  type: keyof TimeTableUserSettings
}

export const TimetableSettingsOnboarding: React.FC = () => {
  const [updateTimetableSettings] = useUpdateTraineeTimetableSettingsMutation()
  const { addToast } = useToastContext()

  const { questions, buttons } = strings.timetablePage.onBoarding

  const onboardingContent: OnboardingContent[] = [
    { text: questions.weekendSchool, type: 'weekendSchool' },
    { text: questions.preFillClass, type: 'preFillClass' },
  ]

  const [indicator, setIndicator] = useState<number>(0)
  const [userTimetableSettings, setUserTimetableSettings] = useState<TimeTableUserSettings>({
    onBoardingTimetable: false,
    weekendSchool: false,
    preFillClass: false,
  })
  const [disabled, setDisabled] = useState(true)

  const handleClick = async () => {
    await updateTimetableSettings({
      variables: { input: { ...userTimetableSettings, onBoardingTimetable: true } },
    })
      .then(() => {
        addToast({
          text: strings.settings.saveSuccess,
          type: 'success',
        })
      })
      .catch((exception: GraphQLError) => {
        addToast({
          text: exception.message,
          type: 'error',
        })
      })
  }

  return (
    <Flex mb="3" flexDirection="column">
      <H1>{strings.timetablePage.onBoarding.title}</H1>
      <Questions
        activeIndex={indicator}
        onboardingContent={onboardingContent}
        userTimetableSettings={userTimetableSettings}
        setUserTimetableSettings={setUserTimetableSettings}
        setDisabled={setDisabled}
        setIndicator={setIndicator}
      />
      <StyledIndicator list={onboardingContent} setIndex={setIndicator} activeIndex={indicator} />

      <PrimaryButton disabled={disabled} onClick={() => handleClick()}>
        {buttons.create}
      </PrimaryButton>
    </Flex>
  )
}
