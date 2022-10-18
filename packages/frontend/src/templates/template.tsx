import React from 'react'

import MainTemplate from './main-template'
import SecondaryTemplate from './secondary-template'

interface TemplateProps {
  children: React.ReactNode
  type?: 'None' | 'Secondary' | 'Main'
}

export const Template: React.FC<TemplateProps> = ({ children, type }) => {
  let TemplateComponent: React.FunctionComponent

  switch (type) {
    case 'None':
      TemplateComponent = React.Fragment
      break
    case 'Secondary':
      TemplateComponent = SecondaryTemplate
      break
    case 'Main':
    default:
      TemplateComponent = MainTemplate
      break
  }

  return <TemplateComponent>{children}</TemplateComponent>
}
