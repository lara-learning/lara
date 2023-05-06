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
import {useTraineePageDataQuery} from "../graphql";
import {Box, Flex} from "@rebass/grid";
import strings from "../locales/localization";
import ProgressBar from "../components/progress-bar";

export const TraineePaperPage: React.FC = () => {
  const {loading, data} = useTraineePageDataQuery()

  if (loading) {
    return <Loader size="xl" padding="xl"/>
  }

  if (!data) {
    return null
  }

  const {currentUser} = data
  if (!currentUser) {
    return null
  }

  return (
    <Template type="Main">
      {data.trainees.map((trainee) => (
        <div key={trainee?.id}>
          {trainee?.papers && trainee?.papers?.length >= 1 ? (
            trainee?.papers.map(paper => (
              <Spacer bottom='xl' key={paper?.id}>
                <Container overflow={'visible'} padding={'l'} >
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
                              {strings.paper.dashboard.briefing}
                            </Flex>
                            <Flex alignItems={'center'}>
                              <StyledIcon name={'X'} size="24px"
                                          color={'errorRed'}/>
                              {strings.paper.dashboard.feedback}
                            </Flex>
                          </Flex>
                          <Flex alignItems={'center'} flexDirection={'row'}
                                justifyContent={'space-between'}>
                            <Flex alignItems={'center'}>
                              <StyledIcon name={'X'} size="24px"
                                          color={'errorRed'}/>
                              {strings.paper.dashboard.conclusion}
                            </Flex>
                            <Flex alignItems={'center'}>
                              <StyledIcon name={'X'} size="24px"
                                          color={'errorRed'}/>
                              {strings.paper.dashboard.pdfFeedback}
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
            ))
          ) : (
            <Text size="copy">{"Kein Paper"}</Text>
          )}
        </div>
      ))}
    </Template>
  )
}
