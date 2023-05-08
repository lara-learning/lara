import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledDashboardPaperStatus = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${Spacings.s};
  padding-right: ${Spacings.xxxl};
`
