import React, { ReactNode } from 'react'

import { Paragraph, StyledMainTemplateWrapper, GlobalBackground } from '@lara/components'

import Loader from '../components/loader'
import Navigation from '../components/navigation'
import { Toasts } from '../components/toasts'

interface MainTemplateProps {
  loading?: boolean
  children: ReactNode
}

const MainTemplate: React.FunctionComponent<MainTemplateProps> = ({ loading, children }) => (
  <div>
    <Navigation />
    <Toasts />
    <StyledMainTemplateWrapper>
      {loading && <Loader size="56px" padding="xl" />}
      {!loading && children}
      <Paragraph center>Lara {TAG || `pre-release @ ${REVISION.substring(0, 7)}`}</Paragraph>
    </StyledMainTemplateWrapper>
    <GlobalBackground />
  </div>
)

export default MainTemplate
