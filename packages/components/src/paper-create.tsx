import React from 'react'
import styled from 'styled-components'

import { Spacings } from './spacing'

const PaperCreateGrid = styled.div`
  display: grid;
  grid-gap: ${Spacings.l};
  background: ${(props) => props.theme.surface};
  border-radius: 5px;
  padding: ${Spacings.l};
`

type PaperCreateLayoutProps = {
  headline: JSX.Element
  children: JSX.Element
}

export const PaperCreateLayout: React.FC<PaperCreateLayoutProps> = ({ headline, children }) => {
  return (
    <PaperCreateGrid>
      {headline}
      {children}
    </PaperCreateGrid>
  )
}
