import React, { useState } from 'react'
import { Template } from '../templates/template'
import EmptyStateHappy from '../assets/illustrations/empty-state-happy'
import { Spacer, Spacings, StyledIcon } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import strings from '../locales/localization'
import { styled } from 'styled-components'
import { PaperFazitHeadline, PaperFazitSubline, PaperSecondarySubline } from './paper-fazit-page'
import { PrimaryButton } from '../components/button'
import { Flex } from '@rebass/grid'
import { useFetchPaperPdf } from '../hooks/use-fetch-pdf'
import { useParams } from 'react-router'
import { useDidSendEmailMutation, useFeedbackDoneQuery } from '../graphql'
const Container = styled.div`
  padding: ${Spacings.xxxl};
  display: flex;
  flex-direction: column;
`
export const PaperFeedbackDone: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  const [fetchPdf] = useFetchPaperPdf()
  const { data } = useFeedbackDoneQuery({ variables: { id: paperId ?? '' } })
  const [didSendEmail] = useDidSendEmailMutation()
  const [fetchedPDF, setFetchedPDF] = useState<boolean>(data?.getPaper?.didSendEmail ?? false)

  const fetchPdfFn = async () => {
    if (!data?.getPaper?.didSendEmail && !fetchedPDF) {
      setFetchedPDF(true)
      didSendEmail({ variables: { id: paperId ?? '', didSendEmail: true } })
      const url = await fetchPdf({ id: paperId ?? '' })
      console.log(url)
    }
  }

  return (
    <Template type="Main">
      <Spacer bottom="m">
        <NavigationButtonLink
          label={strings.back}
          to="/paper"
          icon="ChevronLeft"
          isLeft
          alignLeft
          iconColor="iconLightGrey"
        />
      </Spacer>
      <Container>
        <PaperFazitHeadline>{strings.paper.fazitDone.headline}</PaperFazitHeadline>
        <PaperFazitSubline>{strings.paper.fazitDone.text}</PaperFazitSubline>
        <Spacer bottom="l">
          <div></div>
        </Spacer>
        <PrimaryButton style={{ alignSelf: 'center' }} onClick={fetchPdfFn}>
          {strings.paper.fazitDone.downloadPDF}
        </PrimaryButton>
        <Flex style={{ justifyContent: 'center', alignItems: 'center', paddingTop: `${Spacings.m}` }}>
          <StyledIcon name="Info" size="24px" />
          <PaperSecondarySubline style={{ color: '#000000', marginLeft: '8px' }}>
            {strings.paper.fazitDone.info}
          </PaperSecondarySubline>
        </Flex>
        <EmptyStateHappy />
      </Container>
    </Template>
  )
}
