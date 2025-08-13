import React, { JSX, ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

export interface ButtonLayoutProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  styling?: 'primary' | 'secondary'
  icon?: JSX.Element
  fullsize?: boolean
  danger?: boolean
  ghost?: boolean
}

const primaryDangerStyles = css`
  background: ${(props) => props.theme.primaryDangerDefault};
  color: ${(props) => props.theme.buttonPrimaryFont};
  fill: ${(props) => props.theme.primaryDangerDefault};

  &:hover {
    background: ${(props) => props.theme.primaryDangerHovered};
    color: ${(props) => props.theme.buttonPrimaryFont};
    fill: ${(props) => props.theme.primaryDangerHovered};
  }

  &:active {
    background: ${(props) => props.theme.primaryDangerPressed};
    color: ${(props) => props.theme.buttonPrimaryFont};
    fill: ${(props) => props.theme.primaryDangerPressed};

    &::before {
      display: none;
    }
  }
`

const secondaryDangerStyles = css`
  background: ${(props) => props.theme.secondaryDangerDefault};
  color: ${(props) => props.theme.buttonSecondaryDangerFont};
  fill: ${(props) => props.theme.buttonSecondaryDangerDefault};

  &:hover {
    background: ${(props) => props.theme.secondaryDangerHovered};
    color: ${(props) => props.theme.buttonSecondaryDangerFont};
    fill: ${(props) => props.theme.buttonSecondaryDangerHovered};
  }

  &:active {
    background: ${(props) => props.theme.secondaryDangerPressed};
    color: ${(props) => props.theme.buttonSecondaryDangerFont};
    fill: ${(props) => props.theme.buttonSecondaryDangerPressed};

    &::before {
      display: none;
    }
  }
`

const secondaryGhostDangerStyles = css`
  border: none;
  background: ${(props) => props.theme.buttonSecondaryDangerGhostDefault};
  color: ${(props) => props.theme.buttonSecondaryDangerFont};
  fill: ${(props) => props.theme.buttonSecondaryDangerGhostDefault};

  &:hover {
    background: ${(props) => props.theme.buttonSecondaryDangerGhostHoverd};
    color: ${(props) => props.theme.buttonSecondaryDangerFont};
    fill: ${(props) => props.theme.buttonSecondaryDangerGhostHoverd};
  }

  &:active {
    background: ${(props) => props.theme.buttonSecondaryDangerGhostDefault};
    color: ${(props) => props.theme.buttonSecondaryDangerFont};
    fill: ${(props) => props.theme.buttonSecondaryDangerGhostPressed};

    &::before {
      display: none;
    }
  }
`

const secondaryGhostStyles = css`
  border: none;
  background: transparent;
  box-shadow: none;
  color: ${(props) => props.theme.buttonSecondaryFont};
  fill: ${(props) => props.theme.buttonSecondaryGhostDefault};

  &:hover {
    background: ${(props) => props.theme.secondaryHovered};
    color: ${(props) => props.theme.buttonSecondaryFont};
    fill: ${(props) => props.theme.buttonSecondaryGhostHovered};
  }

  &:active {
    background: ${(props) => props.theme.buttonSecondaryGhostPressed};
    color: ${(props) => props.theme.buttonSecondaryFont};
    fill: ${(props) => props.theme.buttonSecondaryDangerGhostPressed};

    &::before {
      display: none;
    }
  }
`

const primaryButtonWrapper = css<ButtonLayoutProps>`
  background: ${(props) => props.theme.primaryDefault};
  color: ${(props) => props.theme.buttonPrimaryFont};
  fill: ${(props) => props.theme.iconWhite};

  &:hover {
    background: ${(props) => props.theme.primaryHovered};
    color: ${(props) => props.theme.buttonPrimaryFont};
    fill: ${(props) => props.theme.buttonPrimaryFont};
  }

  &:active {
    background: ${(props) => props.theme.primaryPressed};
    color: ${(props) => props.theme.buttonPrimaryFont};
    fill: ${(props) => props.theme.buttonPrimaryFont};

    &::before {
      display: none;
    }
  }

  &:disabled {
    background: ${(props) => props.theme.primaryDisabled};
    color: ${(props) => props.theme.buttonPrimaryFont};
    fill: ${(props) => props.theme.buttonPrimaryFont};
    box-shadow: none;
  }

  ${(props) => props.danger && primaryDangerStyles}
`

const secondaryButtonWrapper = css<ButtonLayoutProps>`
  background: ${(props) => props.theme.secondaryDefault};
  color: ${(props) => props.theme.buttonSecondaryDefault};
  fill: ${(props) => props.theme.buttonSecondaryDefault};

  &:hover {
    background: ${(props) => props.theme.secondaryHovered};
    color: ${(props) => props.theme.buttonSecondaryHovered};
    fill: ${(props) => props.theme.buttonSecondaryHovered};
  }

  &:active {
    background: ${(props) => props.theme.secondaryPressed};
    color: ${(props) => props.theme.buttonSecondaryPressed};
    fill: ${(props) => props.theme.buttonSecondaryPressed};

    &::before {
      display: none;
    }
  }

  &:disabled {
    color: ${(props) => props.theme.buttonSecondaryDisabled};
    fill: ${(props) => props.theme.buttonSecondaryDisabled};
    background: transparent;
    box-shadow: none;
  }

  ${(props) => props.danger && !props.ghost && secondaryDangerStyles}
  ${(props) => props.ghost && !props.danger && secondaryGhostStyles}
  ${(props) => props.ghost && props.danger && secondaryGhostDangerStyles}
`

const buttonStyle = (props: ButtonLayoutProps) => css`
  ${props.styling === 'primary' && primaryButtonWrapper}
  ${props.styling === 'secondary' && secondaryButtonWrapper}

  ${props.fullsize && 'width: 100%'};
`

const ButtonWrapper = styled.button.withConfig({
  shouldForwardProp: (prop) => !['styling', 'fullsize'].includes(prop),
})<ButtonLayoutProps>`
  font-size: ${FontSizes.button};
  border: none;
  letter-spacing: 0.2px;
  border-radius: ${BorderRadii.xxs};
  padding: 0;
  margin: 0;
  cursor: pointer;
  position: relative;
  transition: 0.2s ease;
  box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.2);
  outline: none;

  &:disabled {
    cursor: default;
  }

  &:focus {
    &::before {
      content: '';
      box-sizing: border-box;
      position: absolute;
      border-radius: ${BorderRadii.xxs};
      top: 50%;
      left: 50%;
      width: calc(100% + ${Spacings.xs});
      height: calc(100% + ${Spacings.xs});
      border: 2px solid ${(props) => props.theme.inputBorderActive};
      transform: translate3d(-50%, -50%, 0px);
    }
  }

  ${buttonStyle}
`

const InnerButton = styled.div`
  display: flex;
  align-items: stretch;
`

const IconWrapper = styled.div`
  padding: ${Spacings.xs};
  margin-left: ${Spacings.s};
  max-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['hasIcon'].includes(prop),
})<{ hasIcon: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  font-weight: 600;
  padding: ${(props) =>
    props.hasIcon ? `${Spacings.s} ${Spacings.xl} ${Spacings.s} ${Spacings.xs}` : `${Spacings.s} ${Spacings.xl}`};
`

export const ButtonLayout: React.FC<ButtonLayoutProps> = (props) => {
  return (
    <ButtonWrapper {...props}>
      <InnerButton>
        {props.icon && <IconWrapper>{props.icon}</IconWrapper>}
        <TextWrapper hasIcon={Boolean(props.icon)}>{props.children}</TextWrapper>
      </InnerButton>
    </ButtonWrapper>
  )
}
