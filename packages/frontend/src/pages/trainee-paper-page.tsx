import {
  Container,
  H1,
  Spacer, StyledDashboardPaperStatus,
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
              paper?.traineeId == currentUser.id ?
              <Spacer bottom='xl' key={paper?.id}>
                <Container overflow={'visible'} padding={'l'}>
                    <Box width={[3, 5 / 5]}>
                        <H1 center>
                          {strings.paper.dashboard.title + " " + paper?.client}
                        </H1>
                        <Spacer bottom='xl'>
                          <Text size={"copy"}>
                            {strings.paper.dashboard.description}
                          </Text>
                        </Spacer>
                        <StyledDashboardPaperStatus>
                          <Flex alignItems={"center"}>
                            <StyledIcon name={'CheckMark'} size="24px"
                                        color={'successGreen'}/>
                            <Text>
                              {strings.paper.dashboard.briefing}
                            </Text>
                          </Flex>
                          <Flex alignItems={"center"}>
                            <StyledIcon name={'X'} size="24px"
                                        color={'errorRed'}/>
                            <Text>
                              {strings.paper.dashboard.feedback}
                            </Text>
                          </Flex>
                          <Flex alignItems={"center"}>
                            <StyledIcon name={'X'} size="24px"
                                        color={'errorRed'}/>
                            <Text>
                              {strings.paper.dashboard.conclusion}
                            </Text>
                          </Flex>
                          <Flex alignItems={"center"}>
                            <StyledIcon name={'X'} size="24px"
                                        color={'errorRed'}/>
                            <Text>
                              {strings.paper.dashboard.pdfFeedback}
                            </Text>
                          </Flex>
                        </StyledDashboardPaperStatus>
                      </Box>
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
        ))
      }
    </Template>
  )
}
