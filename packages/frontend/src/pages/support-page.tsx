import React from 'react'

import {
  H2,
  Paragraph,
  StyledSupportExternalLink,
  StyledSupportLayout,
  StyledSupportLink,
  StyledSupportTile,
} from '@lara/components'

import Illustrations from '../components/illustration'
import strings from '../locales/localization'
import { Template } from '../templates/template'

const SupportPage: React.FunctionComponent = () => (
  <Template type="Main">
    <StyledSupportLayout illustration={<Illustrations.Support />}>
      <StyledSupportExternalLink href={`mailto:${ENVIRONMENT.supportMail}`}>
        <StyledSupportTile
          title={<H2 noMargin>{strings.support.contactTitle}</H2>}
          body={<Paragraph noMargin>{strings.support.contactCopy}</Paragraph>}
          icon="Contact"
        />
      </StyledSupportExternalLink>

      <StyledSupportLink to="/faq">
        <StyledSupportTile
          title={<H2 noMargin>{strings.support.faqTitle}</H2>}
          body={<Paragraph noMargin>{strings.support.faqCopy}</Paragraph>}
          icon="QuestionMark"
        />
      </StyledSupportLink>
    </StyledSupportLayout>
  </Template>
)

export default SupportPage
