import styled from 'styled-components'
import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

export const StyledSearch = styled.input`
  margin-left: ${Spacings.s};
  cursor: pointer;
  outline: none;
  font-size: ${FontSizes.copy};
  border: none;
  transition: width 0.3s;
  background-color: ${(props) => props.theme.background};
  ::placeholder {
    color: ${(props) => props.theme.lightFont};
  }
`
export const StyledSearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  background-color: ${(props) => props.theme.background};
  border-radius: ${BorderRadii.xxs};
  align-items: center;
`
