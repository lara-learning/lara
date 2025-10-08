import { Container, H1, Paragraph, Spacer, StyledIcon, Text } from '@lara/components'
import React from 'react'
import Loader from '../components/loader'
import { Template } from '../templates/template'
import { PaperStatus, Trainee, useTraineePaperPageDataQuery } from '../graphql'
import { Box, Flex } from '@lara/components'
import strings from '../locales/localization'
import ProgressBar from '../components/progress-bar'
import { PrimaryButton } from '../components/button'
import EmptyPaper from '../assets/illustrations/empty-paper'
import { useNavigate } from 'react-router'
import { mapStatusToProgess } from '../helper/paper-helper'

export const TraineePaperPage: React.FC = () => {
  const { loading, data } = useTraineePaperPageDataQuery()
  const navigate = useNavigate()

  const navigateToPaperFeedbackPage = (paperId: string) => {
    navigate('/paper/feedback/' + paperId)
  }

  if (!data) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  const currentUser = data.currentUser as Trainee
  if (!currentUser) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  return (
    <Template type="Main">
      {loading && <Loader />}
      {!loading && currentUser && currentUser.papers && currentUser.papers?.length >= 1 ? (
        currentUser?.papers.map((paper) =>
          paper?.traineeId == currentUser.id ? (
            <Spacer bottom="xl" key={paper?.id}>
              <Container overflow={'visible'} padding={'l'}>
                <Box width={1}>
                  <H1 center>{strings.paper.dashboard.title + ' ' + paper?.client + ' - ' + paper?.subject}</H1>
                  <Spacer bottom="xl">
                    <Text size={'copy'}>
                      {strings.paper.dashboard.traineeDiscription.a +
                        paper?.client +
                        strings.paper.dashboard.traineeDiscription.b}
                    </Text>
                  </Spacer>
                  <Flex alignItems={'center'} width={'100%'}>
                    <Box width={2 / 5}>
                      <Flex flexDirection={'row'} alignItems={'center'}>
                        {paper?.briefing.length ? (
                          <StyledIcon name={'CheckMark'} size="24px" color={'successGreen'} />
                        ) : (
                          <StyledIcon name={'X'} size="24px" color={'errorRed'} />
                        )}
                        <Spacer left="xs">
                          <Text>{strings.paper.dashboard.briefing}</Text>
                        </Spacer>
                      </Flex>
                    </Box>
                    <Box width={3 / 5}>
                      <Flex flexDirection={'row'} alignItems={'center'}>
                        {paper?.status === PaperStatus.TraineeDone ? (
                          <StyledIcon name={'CheckMark'} size="24px" color={'successGreen'} />
                        ) : (
                          <StyledIcon name={'X'} size="24px" color={'errorRed'} />
                        )}
                        <Spacer left="xs">
                          <Text>{strings.paper.dashboard.feedback}</Text>
                        </Spacer>
                      </Flex>
                    </Box>
                  </Flex>
                  <Flex alignItems={'center'} width={'100%'}>
                    <Box width={2 / 5}>
                      <Flex flexDirection={'row'} alignItems={'center'}>
                        <StyledIcon name={'X'} size="24px" color={'errorRed'} />
                        <Spacer left="xs">
                          <Text>{strings.paper.dashboard.conclusion}</Text>
                        </Spacer>
                      </Flex>
                    </Box>
                    <Box width={3 / 5}>
                      <Flex flexDirection={'row'} alignItems={'center'}>
                        <StyledIcon name={'X'} size="24px" color={'errorRed'} />
                        <Spacer left="xs">
                          <Text>{strings.paper.dashboard.pdfFeedback}</Text>
                        </Spacer>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
                <Spacer y="xl">
                  <ProgressBar progress={mapStatusToProgess(paper.status)} color={'primaryDefault'} />
                </Spacer>
                {paper?.status === PaperStatus.InProgress ? (
                  <Flex justifyContent={'flex-end'}>
                    <PrimaryButton onClick={() => navigateToPaperFeedbackPage(paper.id)}>
                      {paper?.feedback.length > 0 ? strings.edit : strings.start}
                    </PrimaryButton>
                  </Flex>
                ) : null}
              </Container>
            </Spacer>
          ) : null
        )
      ) : (
        <Flex alignItems={'center'} flexDirection={'column'}>
          <Box width={[1, 3 / 5]}>
            <H1 center>{strings.paper.emptyTrainee.headline}</H1>
            <Paragraph center>{strings.paper.emptyTrainee.description}</Paragraph>

            <EmptyPaper />
          </Box>
        </Flex>
      )}
    </Template>
  )
}
