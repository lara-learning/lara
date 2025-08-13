import { Link } from 'react-router'
import styled from 'styled-components'

import { FontSizes } from './font-size'
import { Fonts } from './fonts'
import { Spacings } from './spacing'

export const StyledWeekLink = styled(Link)`
  text-decoration: none;
`

export const StyledOverviewText = styled.span`
  display: block;
  text-align: center;
  color: ${(props) => props.theme.lightFont};
  margin: ${Spacings.xs};
  margin-bottom: ${Spacings.s};
  font-size: ${FontSizes.smallCopy};
  letter-spacing: 0.2px;
`

export const StyledWeek = styled(StyledOverviewText)`
  font-family: ${Fonts.secondary};
  font-size: ${FontSizes.h1};
  letter-spacing: 0.9px;
  font-weight: bold;
  margin: ${Spacings.m};
  margin-top: ${Spacings.s};
  color: ${(props) => props.theme.darkFont};
`

export const StyledWeekLabel = styled(StyledOverviewText)`
  font-size: ${FontSizes.copy};
  color: ${(props) => props.theme.mediumFont};
`
