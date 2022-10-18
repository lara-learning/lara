import React from 'react'

import { Paragraph, StyledSecondaryTemplateWrapper } from '@lara/components'

const SecondaryTemplate: React.FunctionComponent = ({ children }) => (
  <StyledSecondaryTemplateWrapper>
    {children}
    <Paragraph center>Lara {TAG || `pre-release @ ${REVISION.substring(0, 7)}`}</Paragraph>
  </StyledSecondaryTemplateWrapper>
)

export default SecondaryTemplate
