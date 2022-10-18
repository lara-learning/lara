import styled from 'styled-components'

import { FontSizes } from '../font-size'
import { Spacings } from '../spacing'

export const StyledPrintUserInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: ${Spacings.xs};
  column-gap: ${Spacings.xl};
  margin-bottom: ${Spacings.xxl};
`

export const StyledPrintUserInfoRow = styled.span<{ fullsize?: boolean }>`
  color: ${(props) => props.theme.darkFont};
  font-size: ${FontSizes.copy};
  ${(props) => props.fullsize && 'grid-column: 1/3'};
`
export const StyledPrintUserInfoRowHeadline = styled.span`
  font-weight: bold;
`
