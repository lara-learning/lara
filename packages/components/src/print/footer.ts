import styled from 'styled-components'

import { Spacings } from '../spacing'

export const StyledPrintFooter = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  break-inside: avoid;
`

export const StyledPrintFooterTotalWrapper = styled.div`
  margin-bottom: ${Spacings.xxl};
`

export const StyledPrintSignatureContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: ${Spacings.l};
  align-items: end;
`
