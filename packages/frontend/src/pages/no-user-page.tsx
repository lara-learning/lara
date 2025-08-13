import React from 'react'

import {
  H1,
  H2,
  StyledLogo,
  Paragraph,
  StyledTag,
  StyledNoUserPageWrapper,
  StyledNoUserHeader,
  StyledNoUserHero,
  StyledNoUserPageContent,
  StyledPreviewImage,
  Flex,
  Box,
} from '@lara/components'

import previewImage from '../assets/lara-preview.png'
import strings from '../locales/localization'
import { Template } from '../templates/template'

const NoUserPage: React.FunctionComponent = () => {
  return (
    <Template type="None">
      <StyledNoUserPageWrapper>
        <StyledNoUserHeader>
          <StyledLogo />
        </StyledNoUserHeader>
        <StyledNoUserHero>
          <StyledNoUserPageContent>
            <H1 styleLight>{strings.errors.authenticationError}</H1>
            <H2 styleLight>{strings.errors.authenticationSubtext}</H2>
          </StyledNoUserPageContent>
        </StyledNoUserHero>
        <StyledNoUserPageContent>
          <H2 center>{strings.noUserPage.title}</H2>
          <Paragraph center>{strings.noUserPage.description}</Paragraph>
          <StyledPreviewImage src={previewImage} />
          <Flex flexWrap={'wrap'}>
            <Box width={[1, 1 / 3]} px={'2'}>
              <H2>{strings.noUserPage.featureReports.title}</H2>
              <Paragraph>{strings.noUserPage.featureReports.description}</Paragraph>
            </Box>
            <Box width={[1, 1 / 3]} px={'2'}>
              <H2>{strings.noUserPage.featureHandover.title}</H2>
              <Paragraph>{strings.noUserPage.featureHandover.description}</Paragraph>
            </Box>
            <Box width={[1, 1 / 3]} px={'2'}>
              <H2>
                {strings.noUserPage.featureReviews.title}
                <StyledTag>Soon</StyledTag>
              </H2>
              <Paragraph>{strings.noUserPage.featureReviews.description}</Paragraph>
            </Box>
          </Flex>
        </StyledNoUserPageContent>
      </StyledNoUserPageWrapper>
    </Template>
  )
}

export default NoUserPage
