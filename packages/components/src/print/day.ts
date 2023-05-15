import styled from 'styled-components'

import { FontSizes } from '../font-size'
import { Spacings } from '../spacing'

export const StyledPrintDay = styled.div`
  break-inside: avoid;
  border-bottom: 1px solid ${(props) => props.theme.inputBorderEmpty};
  margin-bottom: ${Spacings.l};

  &:last-child {
    margin-bottom: 0px;
  }
`

export const StyledPrintHeadline = styled.h2`
  margin: 0 0 ${Spacings.m};
  font-size: ${FontSizes.h2};
  color: ${(props) => props.theme.darkFont};
`

export const StyledPrintDayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${Spacings.xs};
`

export const StyledPrintDaySubHeadline = styled.h3`
  font-size: ${FontSizes.smallCopy};
  margin: 0;
  color: ${(props) => props.theme.darkFont};
  text-transform: uppercase;
  letter-spacing: 1.2px;
`

export const StyledPrintPaperSubHeadline = styled.h3`
  font-size: ${FontSizes.copy};
  margin-bottom: ${Spacings.m};
  color: ${(props) => props.theme.darkFont};
  text-transform: uppercase;
  letter-spacing: 1.2px;
`

export const StyledPrintDayStatus = styled.span`
  font-size: ${FontSizes.copy};
  font-weight: 700;
  color: ${(props) => props.theme.blueFont};
`
