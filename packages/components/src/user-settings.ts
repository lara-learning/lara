import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledSettingsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${Spacings.l};
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const StyledSettingsDateGrid = styled.div`
  display: grid;
  grid-gap: ${Spacings.s};
  grid-template-columns: 1fr min-content 1fr;
  align-items: end;
  @media (max-width: 390px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
`

export const StyledSettingsTrainerGrid = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: min-content auto;
`
