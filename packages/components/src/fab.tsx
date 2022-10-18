import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Spacings } from './spacing'

const dangerStyles = css`
  & svg {
    fill: ${(props) => props.theme.redDark};
  }

  &:hover {
    background-color: ${(props) => props.theme.primaryDangerDefault};
  }

  &:active {
    background-color: ${(props) => props.theme.primaryDangerPressed};
  }
`

const StyledFab = styled.button<FabLayoutProps>`
  position: fixed;
  cursor: pointer;
  border-radius: 50%;
  border: none;
  padding: ${Spacings.xs};
  right: ${Spacings.xl};
  bottom: ${Spacings.xl};
  width: ${(props) => (props.large ? Spacings.xxl : Spacings.xl)};
  height: ${(props) => (props.large ? Spacings.xxl : Spacings.xl)};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s ease;

  background: ${(props) => props.theme.secondaryDefault};

  svg {
    fill: ${(props) => props.theme.iconBlue};
  }

  &:hover {
    background: ${(props) => props.theme.primaryHovered};
    color: ${(props) => props.theme.iconWhite};

    svg {
      fill: ${(props) => props.theme.iconWhite};
    }
  }

  &:disabled {
    background-color: ${(props) => props.theme.secondaryDisabled};
    box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.2);

    & svg {
      fill: ${(props) => props.theme.iconWhite};
    }
  }

  &:focus {
    background-color: ${(props) => props.theme.primaryDefault};
    box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.2);

    & svg {
      fill: ${(props) => props.theme.iconWhite};
    }

    &::before {
      content: '';
      box-sizing: border-box;
      position: absolute;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      width: calc(100% + ${Spacings.xs});
      height: calc(100% + ${Spacings.xs});
      border: 2px solid ${(props) => props.theme.inputBorderActive};
      transform: translate3d(-50%, -50%, 0px);
    }
  }

  &:active {
    &::before {
      display: none;
    }
    background-color: ${(props) => props.theme.primaryPressed};
    box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.2);

    & svg {
      fill: ${(props) => props.theme.iconWhite};
    }
  }

  ${(props) => props.danger && dangerStyles}
`

export interface FabLayoutProps extends HTMLAttributes<HTMLButtonElement> {
  danger?: boolean
  large?: boolean
}

export const FabLayout: React.FC<FabLayoutProps> = ({ children, ...rest }) => {
  return <StyledFab {...rest}>{children}</StyledFab>
}
