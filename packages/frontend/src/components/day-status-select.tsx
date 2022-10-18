import React from 'react'

import { IconName } from '@lara/components'

import { Day, DayStatusEnum, useDayStatusSelectUpdateDayMutation } from '../graphql'
import strings from '../locales/localization'
import { SelectWithIcon } from './select'

interface DayStatusSelectProps {
  day: Pick<Day, 'status' | 'id'>
  disabled?: boolean
}

const DayStatusSelect: React.FunctionComponent<DayStatusSelectProps> = ({ day, disabled }) => {
  const [mutate] = useDayStatusSelectUpdateDayMutation()

  const getIcon = (): IconName => {
    switch (day.status) {
      case DayStatusEnum.Sick:
        return 'Pill'
      case DayStatusEnum.Work:
        return 'Work'
      case DayStatusEnum.Vacation:
        return 'Vacation'
      case DayStatusEnum.Education:
        return 'School'
      case DayStatusEnum.Holiday:
        return 'Holiday'
    }

    return 'Work'
  }

  const onChange = (event: React.FormEvent) => {
    const target = event.target as HTMLSelectElement
    const { value } = target
    const { id } = day
    const status = value as DayStatusEnum
    void mutate({
      variables: {
        id,
        status,
      },
      optimisticResponse: {
        updateDay: {
          __typename: 'Day',
          id,
          status,
        },
      },
    })
  }

  return (
    <SelectWithIcon disabled={disabled} value={day.status} icon={getIcon()} onChange={onChange}>
      <option value="work">{strings.dayStatus.work}</option>
      <option value="education">{strings.dayStatus.education}</option>
      <option value="vacation">{strings.dayStatus.vacation}</option>
      <option value="sick">{strings.dayStatus.sick}</option>
      <option value="holiday" disabled>
        {strings.dayStatus.holiday}
      </option>
    </SelectWithIcon>
  )
}

export default DayStatusSelect
