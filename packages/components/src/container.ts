import styled from 'styled-components'
import { BorderRadii } from './border-radius'
import { Spacing, Spacings } from './spacing'

export interface ContainerProps {
  padding?: keyof Spacing
  paddingX?: keyof Spacing
  paddingY?: keyof Spacing
  hoverable?: boolean
  flat?: boolean
  overflow?: 'hidden' | 'scroll' | 'visible'
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !['padding', 'paddingX', 'paddingY', 'hoverable', 'flat', 'overflow'].includes(prop),
})<ContainerProps>`
  display: block;
  overflow: ${(props) => props.overflow || 'hidden'};
  background: ${(props) => props.theme.surface};
  border-radius: ${(props) => (props.flat ? BorderRadii.xxs : BorderRadii.xxs)};
  box-shadow: ${(props) => (props.flat ? 'none' : '0 7px 14px 0 rgba(30, 39, 49, 0.1)')};

  transition: 0.3s all;
  padding-top: ${(props) => props.paddingY && Spacings[props.paddingY]};
  padding-bottom: ${(props) => props.paddingY && Spacings[props.paddingY]};
  padding-left: ${(props) => props.paddingX && Spacings[props.paddingX]};
  padding-right: ${(props) => props.paddingX && Spacings[props.paddingX]};
  padding: ${(props) => props.padding && Spacings[props.padding]};

  &:hover {
    box-shadow: ${(props) => (props.hoverable ? '0 12px 16px 0 rgba(30, 39, 49, 0.2)' : 'default')};
  }
`
