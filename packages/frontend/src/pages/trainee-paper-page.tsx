import { Container, H1, Paragraph, Spacer, StyledIcon, Text } from '@lara/components'
import React from 'react'
import Loader from '../components/loader'
import { Template } from '../templates/template'
import { useTraineePageDataQuery } from '../graphql'
import { Box, Flex } from '@rebass/grid'
import strings from '../locales/localization'
import ProgressBar from '../components/progress-bar'
import { PrimaryButton } from '../components/button'
import EmptyPaper from '../assets/illustrations/empty-paper'

export const TraineePaperPage: React.FC = () => {
  const { loading, data } = useTraineePageDataQuery()

  if (!data) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  const { currentUser } = data
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
      {!loading &&
        data.trainees.map((trainee) => (
          <div key={trainee?.id}>
            {trainee?.papers && trainee?.papers?.length >= 1 ? (
              trainee?.papers.map((paper) =>
                paper?.traineeId == currentUser.id ? (
                  <Spacer bottom="xl" key={paper?.id}>
                    <Container overflow={'visible'} padding={'l'}>
                      <Box width={[3, 5 / 5]}>
                        <H1 center>{strings.paper.dashboard.title + ' ' + paper?.client + ' - ' + paper?.subject}</H1>
                        <Spacer bottom="xl">
                          <Text size={'copy'}>{strings.paper.dashboard.description}</Text>
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
                              <StyledIcon name={'X'} size="24px" color={'errorRed'} />
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
                        <ProgressBar progress={0.3} color={'primaryDefault'} />
                      </Spacer>
                    </Container>
                  </Spacer>
                ) : null
              )
            ) : (
              <Flex alignItems={'center'} flexDirection={'column'}>
                <Box width={[1, 3 / 5]}>
                  <H1 center>{strings.paper.empty.headline}</H1>
                  <Paragraph center>{strings.paper.empty.description}</Paragraph>
                  <Spacer y="l">
                    <Flex alignItems={'center'} flexDirection={'column'}>
                      <PrimaryButton disabled={true}>{strings.paper.empty.createBriefing}</PrimaryButton>
                    </Flex>
                  </Spacer>
                  <EmptyPaper />
                </Box>
              </Flex>
            )}
          </div>
        ))}
    </Template>
  )
}
