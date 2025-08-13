import React from 'react'
import styled from 'styled-components'

import { FontSizes } from './font-size'
import { Spacings } from './spacing'

const TotalLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => !['primary'].includes(prop),
})<StylingProps>`
  color: ${(props) => props.theme.blueFont};
  font-weight: ${(props) => props.primary && 500};
  font-size: ${(props) => (props.primary ? FontSizes.copy : FontSizes.copy)};
  margin-right: ${Spacings.m};
`

const TotalValue = styled.span.withConfig({
  shouldForwardProp: (prop) => !['primary'].includes(prop),
})<StylingProps>`
  font-weight: bold;
  letter-spacing: 0.3px;
  font-size: ${(props) => (props.primary ? FontSizes.copy : FontSizes.copy)};
  color: ${(props) => props.theme.mediumFont};
  margin-right: 46px;
`

interface StylingProps {
  primary?: boolean
}

interface TotalLayoutProps extends StylingProps {
  minutes: string
  total?: string
}

export const TotalLayout: React.FunctionComponent<TotalLayoutProps> = ({ primary, total, minutes }) => (
  <>
    <TotalLabel primary={primary}>{total}</TotalLabel>
    <TotalValue primary={primary}>{minutes}</TotalValue>
  </>
)
