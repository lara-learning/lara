import styled from 'styled-components'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'

export const StyledTag = styled.span`
  font-size: ${FontSizes.copy};
  color: ${(props) => props.theme.buttonPrimaryFont};
  border: 1px solid ${(props) => props.theme.buttonPrimaryFont};
  border-radius: ${BorderRadii.xxs};
  padding: 6px 8px;
  margin-left: 12px;
  text-transform: uppercase;
`
