import React from 'react'

import { StyledPrintTotalContainer, StyledPrintTotalLabel, StyledPrintTotalValue } from '@lara/components'

import { minutesToString } from '../utils/time.js'

type TotalProps = {
  time: number
  label: string
}

export const Total: React.FC<TotalProps> = ({ label, time }) => {
  return (
    <StyledPrintTotalContainer>
      <StyledPrintTotalLabel>{label}:</StyledPrintTotalLabel>
      <StyledPrintTotalValue>{minutesToString(time)}</StyledPrintTotalValue>
    </StyledPrintTotalContainer>
  )
}
