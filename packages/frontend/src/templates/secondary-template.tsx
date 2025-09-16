import React, { ReactNode } from 'react'

import { Paragraph, StyledSecondaryTemplateWrapper } from '@lara/components'
import { Toasts } from '../components/toasts'

interface SecondaryTemplateProps {
  children: ReactNode
}

const SecondaryTemplate: React.FunctionComponent<SecondaryTemplateProps> = ({ children }) => (
  <div>
    <Toasts />
    <StyledSecondaryTemplateWrapper>
      {children}
      <Paragraph center>Lara {TAG || `pre-release @ ${REVISION.substring(0, 7)}`}</Paragraph>
    </StyledSecondaryTemplateWrapper>
  </div>
)

export default SecondaryTemplate
