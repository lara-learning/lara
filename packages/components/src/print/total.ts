import styled from 'styled-components'

import { Spacings } from '../spacing'

export const StyledPrintTotalContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: ${Spacings.m} ${Spacings.s};
`

export const StyledPrintTotalLabel = styled.span`
  color: ${(props) => props.theme.blueFont};
  margin-right: ${Spacings.m};
  font-size: ${Spacings.m};
`

export const StyledPrintTotalValue = styled.span`
  color: ${(props) => props.theme.mediumFont};
  font-weight: bold;
  font-size: ${Spacings.m};
`
