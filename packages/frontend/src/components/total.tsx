import React from 'react'
import { TotalLayout } from '@lara/components'

import TimeConversion from '../helper/time-conversion'
import strings from '../locales/localization'
interface StylingProps {
  primary?: boolean
}

interface TotalProps extends StylingProps {
  minutes: number
  perWeek?: boolean
}

const Total: React.FunctionComponent<TotalProps> = ({ primary, perWeek, minutes }) => (
  <TotalLayout
    primary={primary}
    total={perWeek ? strings.report.total : strings.total}
    minutes={TimeConversion.minutesToString(minutes)}
  ></TotalLayout>
)

export default Total
