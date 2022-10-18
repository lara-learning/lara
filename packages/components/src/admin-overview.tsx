import React from 'react'
import styled from 'styled-components'

import { Spacings } from './spacing'

const AdminOverviewGrid = styled.div`
  display: grid;
  grid-gap: ${Spacings.l};
`

type AdminOverviewLayoutProps = {
  heading: JSX.Element
}

export const AdminOverviewLayout: React.FC<AdminOverviewLayoutProps> = ({ heading, children }) => {
  return (
    <div>
      {heading}
      <AdminOverviewGrid>{children}</AdminOverviewGrid>
    </div>
  )
}

const AdminCreateUserGrid = styled.div`
  display: grid;
  grid-gap: ${Spacings.xl};
`

type AdminCreateUserLayoutProps = {
  headline: JSX.Element
  description: JSX.Element
}

export const AdminCreateUserLayout: React.FC<AdminCreateUserLayoutProps> = ({ headline, description, children }) => {
  return (
    <>
      <AdminCreateUserGrid>
        <div>
          {headline}
          {description}
        </div>

        {children}
      </AdminCreateUserGrid>
    </>
  )
}
