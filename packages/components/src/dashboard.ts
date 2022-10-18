import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledDashboardWeeks = styled.div`
  display: grid;
  margin-top: ${Spacings.xl};
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: ${Spacings.xl};

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 550px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 350px) {
    grid-template-columns: 1fr;
  }
`
