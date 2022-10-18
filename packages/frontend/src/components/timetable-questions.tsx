import { Paragraph } from '@lara/components'
import { Flex } from '@rebass/grid'
import React, { SyntheticEvent } from 'react'
import strings from '../locales/localization'
import { SecondaryButton } from './button'
import { OnboardingContent, TimeTableUserSettings } from './timetable-onboarding'

type QuestionsProps = {
  activeIndex: number
  onboardingContent: OnboardingContent[]
  userTimetableSettings: TimeTableUserSettings
  setUserTimetableSettings: React.Dispatch<React.SetStateAction<TimeTableUserSettings>>
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
  setIndicator: React.Dispatch<React.SetStateAction<number>>
}

export const Questions: React.FC<QuestionsProps> = ({
  activeIndex,
  onboardingContent,
  userTimetableSettings,
  setUserTimetableSettings,
  setDisabled,
  setIndicator,
}) => {
  const { buttons } = strings.timetablePage.onBoarding

  const handleSelection = (e?: SyntheticEvent<HTMLButtonElement>) => {
    if (e?.currentTarget.value === 'yes') {
      setUserTimetableSettings({
        ...userTimetableSettings,
        [onboardingContent[activeIndex].type]: true,
      })
    } else {
      setUserTimetableSettings({
        ...userTimetableSettings,
        [onboardingContent[activeIndex].type]: false,
      })
    }

    if (activeIndex === onboardingContent.length - 1) {
      setDisabled(false)
    } else {
      setIndicator(activeIndex + 1)
    }
  }

  return (
    <>
      <Paragraph>{onboardingContent[activeIndex]?.text}</Paragraph>
      <Flex flexDirection="row" justifyContent="space-around" width={1}>
        <SecondaryButton value="yes" onClick={handleSelection}>
          {buttons.yes}
        </SecondaryButton>
        <SecondaryButton value="no" onClick={handleSelection}>
          {buttons.no}
        </SecondaryButton>
      </Flex>
    </>
  )
}
