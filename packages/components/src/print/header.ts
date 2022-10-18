import styled from 'styled-components'

import { Spacings } from '../spacing'

export const StyledPrintHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${Spacings.xl};
  color: ${(props) => props.theme.darkFont};
`
