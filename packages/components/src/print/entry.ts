import styled from 'styled-components'

import { FontSizes } from '../font-size'
import { Spacings } from '../spacing'

export const StyledPrintEntry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${Spacings.s};

  &:nth-child(even) {
    background-color: ${(props) => props.theme.reportGrey};
  }
`

export const StyledPrintPaperEntry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${Spacings.s};
  background-color: ${(props) => props.theme.reportGrey};
`

export const StyledPrintEntryText = styled.span`
  color: ${(props) => props.theme.mediumFont};
  font-size: ${FontSizes.copy};
  padding-right: ${Spacings.s};
`
