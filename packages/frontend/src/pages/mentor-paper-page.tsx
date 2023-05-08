import {
  Container,
  H1,
  Paragraph,
  Spacer,
  StyledIcon,
  Text,
} from '@lara/components'
import React from 'react'
import Loader from '../components/loader'
import {Template} from '../templates/template'
import {useMentorPaperPageDataQuery} from "../graphql";
import {Mentor} from "@lara/api";
import {Box, Flex} from "@rebass/grid";
import strings from "../locales/localization";
import ProgressBar from "../components/progress-bar";

export const MentorPaperPage: React.FC = () => {
  const {loading, data} = useMentorPaperPageDataQuery()

  if (loading) {
    return <Loader size="xl" padding="xl"/>
  }

  if (!data) {
    return null
  }

  const currentUser = data?.currentUser as Mentor
  if (!currentUser) {
    return null
  }
  return (
    <Template type="Main">
      <div key={currentUser?.id}>
        {currentUser?.papers && currentUser?.papers?.length >= 1 ? (
          currentUser?.papers.map(paper => (
            paper?.mentorId == currentUser.id ?
              <Spacer bottom='xl' key={paper?.id}>
                <Container overflow={'visible'} padding={'l'} key={paper?.id}>
                  <Flex alignItems={'flex-start'} flexDirection={'row'}>
                    <Box width={[3, 5 / 5]}>
                      <Flex alignItems={'center'} flexDirection={'column'}>
                        <H1 center>
                          {strings.paper.dashboard.title + " " + paper?.client}
                        </H1>
                        <Spacer bottom='xl'>
                          <Paragraph center>
                            {strings.paper.dashboard.description}
                          </Paragraph>
                        </Spacer>
                        <Box width={[0, 3 / 5]}>
                          <Flex alignItems={'center'} flexDirection={'row'}
                                justifyContent={'space-between'}>
                            <Flex alignItems={'center'}>
                              {paper?.briefing.length ? (
                                <StyledIcon name={'CheckMark'} size="24px"
                                            color={'successGreen'}/>
                              ) : (
                                <StyledIcon name={'X'} size="24px"
                                            color={'errorRed'}/>
                              )}
                              <Text>
                                {strings.paper.dashboard.briefing}
                              </Text>
                            </Flex>
                            <Flex alignItems={'center'}>
                              <StyledIcon name={'X'} size="24px"
                                          color={'errorRed'}/>
                              <Text>
                                {strings.paper.dashboard.feedback}
                              </Text>
                            </Flex>
                          </Flex>
                          <Flex alignItems={'center'} flexDirection={'row'}
                                justifyContent={'space-between'}>
                            <Flex alignItems={'center'}>
                              <StyledIcon name={'X'} size="24px"
                                          color={'errorRed'}/>
                              <Text>
                                {strings.paper.dashboard.conclusion}
                              </Text>
                            </Flex>
                            <Flex alignItems={'center'}>
                              <StyledIcon name={'X'} size="24px"
                                          color={'errorRed'}/>
                              <Text>
                                {strings.paper.dashboard.pdfFeedback}
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                  <Spacer y='xl'>
                    <ProgressBar progress={0.3} color={'primaryDefault'}/>
                  </Spacer>
                </Container>
              </Spacer>
              : null
          ))
        ) : (
          <Text size="copy">{"Kein Paper"}</Text>
        )}
      </div>
    </Template>
  )
}
