import styled from 'styled-components'

import { FontSizes } from './font-size'
import { Spacings } from './spacing'

interface ActiveProps {
  active: boolean
}

export const StyledSuggestionWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const StyledSuggestionList = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<ActiveProps>`
  width: 100%;
  position: absolute;
  z-index: 2;
  display: ${(props) => (props.active ? 'block' : 'none')};
  white-space: pre;
  box-shadow: 0 7px 14px 0 rgba(30, 39, 49, 0.1);
`

export const StyledSuggestionItem = styled.div`
  /* TODO: Fix magic number */
  max-height: 84px;
  overflow: hidden;
  color: ${(props) => props.theme.mediumFont};
  letter-spacing: 0.3px;
  font-size: ${FontSizes.copy};
  border-bottom: 1px solid ${(props) => props.theme.inputBorderEmpty};
  background-color: ${(props) => props.theme.surface};
  cursor: pointer;
  padding: ${Spacings.m};
  &:hover {
    background-color: ${(props) => props.theme.activeSuggestionBackground};
    overflow: scroll;
  }
`
