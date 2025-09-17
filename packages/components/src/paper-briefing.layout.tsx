import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Spacings } from './spacing'

export const StyledPaperTitle = styled.h1`
  font-size: 200px;
  color: ${(props) => props.theme.faq};
  margin: 0;
  z-index: 0;
`

const StyledPaperLayout = styled.div`
  display: grid;
  justify-items: center;
  grid-gap: ${Spacings.s};
`

interface PaperLayoutProps {
  children: ReactNode
}

export const PaperLayout: React.FC<PaperLayoutProps> = ({ children }) => {
  return <StyledPaperLayout>{children}</StyledPaperLayout>
}
