import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { Spacings } from './spacing'
import { FontSizes } from './font-size'
import { BorderRadii } from './border-radius'

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  height: 100%;
`

interface StyledActionInterface {
  danger?: boolean
  noMargin?: boolean
}

export const StyledAction = styled.button<StyledActionInterface>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(${FontSizes.copy} + ${Spacings.m});
  height: calc(${FontSizes.copy} + ${Spacings.m});
  border-radius: ${BorderRadii.round};
  transition: all 0.25s;
  margin-left: ${(props) => (props.noMargin ? 0 : Spacings.xs)};
  padding: ${Spacings.xs};
  z-index: 3;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  background: none;
  outline: none;

  &:hover {
    background: ${(props) => (props.danger ? props.theme.secondaryDangerHovered : props.theme.buttonSecondaryHovered)};
    color: ${(props) => (props.danger ? props.theme.buttonSecondaryDangerHovered : props.theme.buttonSecondaryHovered)};
    fill: ${(props) => (props.danger ? props.theme.buttonSecondaryDangerHovered : props.theme.buttonSecondaryHovered)};
    svg {
      fill: ${(props) => (props.danger ? props.theme.errorRed : props.theme.iconBlue)};
    }
  }

  &:disabled {
    background-color: ${(props) => props.theme.secondaryDisabled};
    box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.2);

    & svg {
      fill: ${(props) => props.theme.iconWhite};
    }
  }

  &:focus-visible {
    background-color: ${(props) => props.theme.primaryDefault};
    box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.2);

    & svg {
      fill: ${(props) => props.theme.iconWhite};
    }
  }
`

interface EntryContainerProps {
  disabled?: boolean
  clickable?: boolean
  isDraggedOver?: boolean
  isDragged?: boolean
  dragFromTopToBottom?: boolean
}

export const StyledEntryContainer = styled.div<EntryContainerProps>`
  position: relative;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  cursor: ${({ clickable, disabled }) => !disabled && clickable && 'pointer'};
  background-color: ${(props) => props.theme.surface};
  transition: all 0.1s;

  opacity: ${(props) => props.isDragged && '0.5'};

  padding-bottom: ${(props) => props.dragFromTopToBottom && props.isDraggedOver && !props.isDragged && '55px'};
  padding-top: ${(props) => !props.dragFromTopToBottom && props.isDraggedOver && !props.isDragged && '55px'};

  &:hover {
    border-left: ${(props) =>
      !props.disabled && !props.isDragged && !props.isDraggedOver && `6px solid ${props.theme.inputBorderActive}`};

    ${ActionWrapper} {
      opacity: 1;
    }
  }
`

export const StyledEntryValueWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.inputBorderEmpty};
  margin: 0 calc(${Spacings.l} - 6px);
`

const ValueBase = styled.div`
  color: ${(props) => props.theme.mediumFont};
  font-size: ${FontSizes.copy};
  padding: ${Spacings.m} ${Spacings.l};
`
const TextWrapper = styled(ValueBase)`
  position: relative;
  flex: 1;
  overflow: hidden;
  line-height: 1.4;
  padding-left: 0;
`

const Text = styled.p`
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
`

const Time = styled(ValueBase)`
  width: 100px;
  text-align: right;
  line-height: 1.4;
  padding-right: 0;
`

export const StyledCommentInput = styled.div`
  padding: ${Spacings.m} ${Spacings.l};
`
export const StyledInputWrapper = styled.button`
  display: flex;
  text-align: inherit;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  background: none;
  width: 100%;
`

export const ActionTriangle = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  overflow: hidden;
  transform: rotate(270deg);

  &:after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: ${(props) => props.theme.surface};
    transform: rotate(45deg);
    top: 28px;
    left: 0px;
  }
`

export const ActionsWrapper = styled.div`
  display: flex;
  height: 40px;
  border-radius: 0px 4px 4px 0px;
  align-items: center;
  background-color: ${(props) => props.theme.surface};
  padding-right: ${Spacings.xs};
`

export const ActionDivider = styled.div`
  width: 1px;
  height: ${Spacings.l};
  margin: 0 ${Spacings.xxs} 0;
  background-color: ${(props) => props.theme.inputBorderEmpty};
`

export const ContextMenuWrapper = styled.div`
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  will-change: filter;
  display: flex;
  position: absolute;
  right: calc(-1 * (${Spacings.xxl} + ${Spacings.l}));
`

interface EntryInputLayoutProps extends HTMLAttributes<HTMLElement>, EntryContainerProps {
  text: string
  time: string
  actions: JSX.Element
  clickHandler: React.Dispatch<React.SetStateAction<boolean>>
}

export const EntryInputLayout: React.FC<EntryInputLayoutProps> = ({ text, time, actions, clickHandler, ...rest }) => {
  return (
    <>
      <StyledEntryContainer {...rest}>
        <StyledEntryValueWrapper>
          <StyledInputWrapper onClick={() => clickHandler(true)}>
            <TextWrapper>
              <Text>{text}</Text>
            </TextWrapper>
            <Time>{time}</Time>
          </StyledInputWrapper>
          <ActionWrapper>{actions}</ActionWrapper>
        </StyledEntryValueWrapper>
      </StyledEntryContainer>
    </>
  )
}
