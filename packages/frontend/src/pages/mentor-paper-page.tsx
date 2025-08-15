import { Container, H1, Paragraph, Spacer, StyledIcon, Text } from '@lara/components'
import React from 'react'
import { Template } from '../templates/template'
import { useMentorPaperPageDataQuery } from '../graphql'
import { Mentor } from '@lara/api'
import { Box, Flex } from '@rebass/grid'
import strings from '../locales/localization'
import ProgressBar from '../components/progress-bar'
import Loader from '../components/loader'

export const MentorPaperPage: React.FC = () => {
  const { loading, data } = useMentorPaperPageDataQuery()

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
                      </Flex>
                    </Box>
                  </Flex>
                  <Spacer y="xl">
                    <ProgressBar progress={0.3} color={'primaryDefault'} />
                  </Spacer>
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
