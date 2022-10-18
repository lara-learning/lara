import React from 'react'

import { Container, H1, Paragraph, Spacer, StyledOnBoardingWrapper } from '@lara/components'

import Loader from '../components/loader'
import TraineeSettings from '../components/trainee-settings'
import { useOnboardingPageDataQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'

const OnboardingPage: React.FunctionComponent = () => {
  const { loading, data } = useOnboardingPageDataQuery()

  return (
    <Template type={'Secondary'}>
      {(loading || !data?.currentUser) && <Loader />}

      {!loading && data && data.currentUser && (
        <StyledOnBoardingWrapper>
          <Container>
            <Spacer x="l" y="m">
              <H1>
                {strings.onboarding.hello} {data.currentUser.firstName}!
              </H1>
              <Paragraph>{strings.onboarding.intro}</Paragraph>
              <TraineeSettings disableUIFeedback />
            </Spacer>
          </Container>
        </StyledOnBoardingWrapper>
      )}
    </Template>
  )
}

export default OnboardingPage
