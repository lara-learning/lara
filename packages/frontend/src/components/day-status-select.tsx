import React from 'react'

import { IconName } from '@lara/components'

import { Day, DayStatusEnum, useDayStatusSelectUpdateDayMutation } from '../graphql'
import strings from '../locales/localization'
import { SelectWithIcon } from './select'

interface DayStatusSelectProps {
  day: Pick<Day, 'status' | 'id' | 'status_split'>
  disabled?: boolean
  secondary: boolean
}

const DayStatusSelect: React.FunctionComponent<DayStatusSelectProps> = ({ day, disabled, secondary }) => {
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

  const getIconSecondary = (): IconName => {
    switch (day.status_split) {
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
    const status = secondary ? undefined : (value as DayStatusEnum)
    const status_split = secondary ? (value as DayStatusEnum) : undefined
    void mutate({
      variables: {
        id,
        status,
        status_split,
      },
      optimisticResponse: {
        updateDay: {
          __typename: 'Day',
          id,
          status,
          status_split,
        },
      },
    })
  }

  return (
    <SelectWithIcon
      disabled={disabled}
      value={!secondary ? day.status : day.status_split}
      icon={!secondary ? getIcon() : getIconSecondary()}
      onChange={onChange}
    >
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
