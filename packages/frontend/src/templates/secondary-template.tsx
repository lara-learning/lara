import React, { ReactNode } from 'react'

import { Paragraph, StyledSecondaryTemplateWrapper } from '@lara/components'

interface SecondaryTemplateProps {
  children: ReactNode
}

const SecondaryTemplate: React.FunctionComponent<SecondaryTemplateProps> = ({ children }) => (
  <StyledSecondaryTemplateWrapper>
    {children}
    <Paragraph center>Lara {TAG || `pre-release @ ${REVISION.substring(0, 7)}`}</Paragraph>
  </StyledSecondaryTemplateWrapper>
)

export default SecondaryTemplate
