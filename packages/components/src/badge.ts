import styled from 'styled-components'

import { FontSizes } from './font-size'
import { Spacings } from './spacing'

export const StyledBadge = styled.div`
  display: inline-block;
  background: ${(props) => props.theme.primaryDefault};
  color: ${(props) => props.theme.buttonPrimaryFont};
  font-size: ${FontSizes.copy};
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: ${Spacings.xs};
  border-radius: 3px;
  user-select: none;
`
