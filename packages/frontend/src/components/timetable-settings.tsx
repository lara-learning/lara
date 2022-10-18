import { Paragraph } from '@lara/components'
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import { useTraineeSettingsDataQuery, useUpdateTraineeTimetableSettingsMutation } from '../graphql'
import strings from '../locales/localization'
import Loader from './loader'
import ToggleSwitch from './toggle-switch'

export const TimetableSettings: React.FC = () => {
  const { loading, data } = useTraineeSettingsDataQuery()
  const [updateTimetableSettings] = useUpdateTraineeTimetableSettingsMutation()

  if (loading || !data) {
    return <Loader size="56px" padding="56px" />
  }

  const { currentUser } = data

  if (!currentUser || currentUser.__typename !== 'Trainee') {
    return null
  }

  const { timetableSettings } = currentUser

  if (!timetableSettings) {
    return null
  }
  const { weekendSchool = false, preFillClass = false, onBoardingTimetable = false } = timetableSettings

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="row" paddingBottom="12px" justifyContent="space-between" alignItems="center">
        <Box width="75%">
          <Paragraph noMargin> {strings.timetablePage.onBoarding.questions.weekendSchool}</Paragraph>
        </Box>
        <Box>
          <ToggleSwitch
            checked={weekendSchool}
            handleClick={() =>
              updateTimetableSettings({
                variables: { input: { weekendSchool: !weekendSchool, preFillClass, onBoardingTimetable } },
              })
            }
          />
        </Box>
      </Flex>
      <Flex flexDirection="row" paddingBottom="12px" justifyContent="space-between" alignItems="center">
        <Box width="75%">
          <Paragraph noMargin> {strings.timetablePage.onBoarding.questions.preFillClass}</Paragraph>
        </Box>
        <Box>
          <ToggleSwitch
            checked={preFillClass}
            handleClick={() =>
              updateTimetableSettings({
                variables: { input: { preFillClass: !preFillClass, onBoardingTimetable, weekendSchool } },
              })
            }
          />
        </Box>
      </Flex>
    </Flex>
  )
}
