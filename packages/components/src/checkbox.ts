import styled, { css } from 'styled-components'
import { StyledIcon } from './icons'

interface StyledCheckboxProps {
  checked: boolean
}

export const StyledCheckBox = styled.div<StyledCheckboxProps>`
  position: relative;
  cursor: pointer;
`

export const StyledCheckBoxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`

export const StyledCheckboxIcon = styled(StyledIcon)<StyledCheckboxProps>`
  fill: ${(props) => props.theme.iconDarkGrey};

  &:hover,
  &:focus,
  ${StyledCheckBoxInput}:focus + & {
    #box {
      fill: ${(props) => props.theme.iconBlue};
    }
  }

  #checkmark {
    visibility: hidden;
    transform: scale(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  ${(props) =>
    props.checked &&
    css`
      #checkmark {
        visibility: visible;
        transform: scale(1);
      }

      fill: ${props.theme.iconBlue};
    `}
`
