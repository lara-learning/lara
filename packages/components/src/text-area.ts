import styled from 'styled-components'

import { FontSizes } from './font-size'
import { Fonts } from './fonts'
import { Spacings } from './spacing'

export const StyledTextArea = styled.textarea`
  padding: ${Spacings.l};
  box-sizing: border-box;
  width: 100%;
  height: 77px;
  font-family: ${Fonts.primary};
  font-size: ${FontSizes.copy};
  border: none;
  resize: none;
  outline: none;
  color: ${(props) => props.theme.mediumFont};
  background-color: ${(props) => props.theme.surface};
  :focus {
    color: ${(props) => props.theme.darkFont};
  }
  ::placeholder {
    color: ${(props) => props.theme.lightFont};
  }
`
