import { Container, H1, Paragraph, Spacer, StyledIcon, Text } from '@lara/components'
import React from 'react'
import { Template } from '../templates/template'
import { Mentor, PaperStatus, useMentorPaperPageDataQuery } from '../graphql'
import { Box, Flex } from '@lara/components'
import strings from '../locales/localization'
import ProgressBar from '../components/progress-bar'
import Loader from '../components/loader'
import { useNavigate } from 'react-router'
import { PrimaryButton } from '../components/button'
import { mapStatusToProgess } from '../helper/paper-helper'

export const MentorPaperPage: React.FC = () => {
  const { loading, data } = useMentorPaperPageDataQuery()
  const navigate = useNavigate()

  if (!data) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  const currentUser = data?.currentUser as Mentor

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
      <div key={currentUser?.id}>
        {!loading && currentUser?.papers && currentUser?.papers?.length >= 1 ? (
          currentUser?.papers.map((paper) =>
            paper?.mentorId == currentUser.id ? (
              <Spacer bottom="xl" key={paper?.id}>
                <Container overflow={'visible'} padding={'l'} key={paper?.id}>
                  <Flex alignItems={'flex-start'} flexDirection={'row'}>
                    <Box width={[3, 5 / 5]}>
                      <Flex alignItems={'center'} flexDirection={'column'}>
                        <H1 center>{strings.paper.dashboard.title + ' ' + paper?.client + ' - ' + paper?.subject}</H1>
                        <Spacer bottom="xl">
                          <Paragraph center>{strings.paper.dashboard.description}</Paragraph>
                        </Spacer>
                        <Flex alignItems={'center'} width={'100%'}>
                          <Box width={2 / 5}>
                            <Flex flexDirection={'row'} alignItems={'center'}>
                              {paper?.status !== PaperStatus.NotStarted ? (
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
                              {[PaperStatus.MentorDone].includes(paper?.status) ? (
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
                      </Flex>
                    </Box>
                  </Flex>
                  <Spacer y="xl">
                    <ProgressBar progress={mapStatusToProgess(paper.status)} color={'primaryDefault'} />
                  </Spacer>
                  {paper?.status === PaperStatus.TraineeDone ? (
                    <Flex justifyContent={'flex-end'}>
                      <PrimaryButton onClick={() => navigate(`/paper/feedback/${paper?.id}`)}>
                        {paper.feedbackMentor.length > 0 ? strings.edit : strings.start}
                      </PrimaryButton>
                    </Flex>
                  ) : null}
                </Container>
              </Spacer>
            ) : null
          )
        ) : (
          <Text size="copy">{'Kein Paper'}</Text>
        )}
      </div>
    </Template>
  )
}
