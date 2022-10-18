import React from 'react'
import styled, { css } from 'styled-components'

import { Container } from './container'
import { Spacings } from './spacing'

interface ModalOverlayProps {
  show: boolean
}

interface ModalContainerProps {
  large?: boolean
  timetable?: boolean
}

export interface ModelStylingProps extends ModalOverlayProps, ModalContainerProps {}

interface ModalLayoutProps extends ModelStylingProps {
  button: JSX.Element
}

const ModalOverlay = styled.div<ModalOverlayProps>`
  position: fixed;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  padding: 0 ${Spacings.m};
`

const ModalContainer = styled(Container)<ModalContainerProps>`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: ${(props) => (props.large ? '800px' : '580px')};
  ${(props) =>
    props.timetable &&
    css`
      overflow: scroll;
      max-height: 95vh;
    `}
`

export const ModalLayout: React.FC<ModalLayoutProps> = ({ show, button, children, large, timetable }) => {
  return (
    <ModalOverlay show={show}>
      <ModalContainer large={large} timetable={timetable} padding={'l'}>
        {children}
        {button}
      </ModalContainer>
    </ModalOverlay>
  )
}
