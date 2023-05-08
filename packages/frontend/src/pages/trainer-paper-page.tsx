import React from 'react'
import {RouteComponentProps} from 'react-router'

import {
  Container,
  H1,
  Paragraph,
  Spacer, StyledAction, StyledIcon, StyledName, Text,
} from '@lara/components'
import {Box, Flex} from '@rebass/grid'

import {PrimaryButton} from '../components/button'
import strings from '../locales/localization'
import {Template} from "../templates/template";
import EmptyPaper from "../assets/illustrations/empty-paper";
import {
  Trainer,
  useDeletePaperMutation,
  useTrainerPaperPageDataQuery
} from "../graphql";
import Loader from "../components/loader";
import ProgressBar from "../components/progress-bar";
import Avatar from "../components/avatar";
import {GraphQLError} from "graphql/index";
import {useToastContext} from "../hooks/use-toast-context";

export const TrainerPaperPage: React.FC<RouteComponentProps> = ({history}) => {
  const {loading, data} = useTrainerPaperPageDataQuery()
  const [deletePaper] = useDeletePaperMutation()
  const {addToast} = useToastContext()

  if (loading) {
    return <Loader size="xl" padding="xl"/>
  }

  if (!data) {
    return null
  }

  const currentUser = data?.currentUser as Trainer
  if (!currentUser) {
    return null
  }

  const handleDelete = async (paperId: string | undefined) => {
    if (!paperId) return
    await deletePaper({
      variables: {
        paperId: paperId,
      },
      updateQueries: {
        TrainerPaperPageData: (prevData, {mutationResult}) => {
          return {
            ...prevData,
            papers: mutationResult.data?.deletePaper,
          }
        },
      },
    }).then(() => {
      addToast({
        icon: 'Bulb',
        title: strings.paper.deletePaper.title,
        text: strings.paper.deletePaper.text,
        type: 'success',
      })
    })
      .catch((exception: GraphQLError) => {
        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })
      })
  }

  return (
    <Template type="Main">
      <div key={currentUser.id}>
        {currentUser?.papers && currentUser?.papers?.length >= 1 ? (
          currentUser?.papers?.map((paper) => (
            paper?.trainerId == currentUser.id ?
              <Spacer bottom='xl' key={paper?.id}>
                <Container overflow={'visible'} padding={'l'} key={paper?.id}>
                  <Flex alignItems={'flex-start'} flexDirection={'row'}>
                    <Box width={[3, 5 / 5]}>
                      <Flex justifyContent={"space-between"}
                            alignItems={'center'}>
                        <H1 center>
                          {strings.paper.dashboard.title + " " + paper?.client}
                        </H1>
                        <StyledAction onClick={() => handleDelete(paper?.id)}
                                      danger
                                      noMargin={true}>
                          <StyledIcon name={'Trash'} size={'30px'}
                                      color={'errorRed'}/>
                        </StyledAction>
                      </Flex>
                      <Flex alignItems={'center'} flexDirection={'column'}>
                        {currentUser?.trainees?.map((trainee) => (
                          trainee.id == paper?.traineeId ?

                            <Flex alignItems={'center'}
                                  justifyContent={"flex-start"}
                                  key={trainee.id}>
                              <Text size={"copy"}>
                                {strings.paper.dashboard.trainee}:
                              </Text>
                              <StyledName>
                                {trainee.firstName} {trainee.lastName}
                              </StyledName>
                              <Avatar size={44} image={trainee.avatar}/>
                            </Flex> : <></>
                        ))}
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
          <Flex alignItems={'center'} flexDirection={'column'}>
            <Box width={[1, 3 / 5]}>
              <H1 center>
                {strings.paper.empty.headline}
              </H1>
              <Paragraph center>
                {strings.paper.empty.description}
              </Paragraph>
              <Spacer y="l">
                <Flex alignItems={'center'} flexDirection={'column'}>
                  <PrimaryButton
                    onClick={() => history.push('/paper/createBriefing')}>{strings.paper.empty.createBriefing}
                  </PrimaryButton>
                </Flex>
              </Spacer>
              <EmptyPaper/>
            </Box>
          </Flex>
        )}
        {currentUser?.papers && currentUser?.papers?.length >= 1 ? (
          <Container overflow={'visible'} padding={'l'}>
            <Flex alignItems={'center'} flexDirection={'row'}>
              <EmptyPaper/>
              <Box width={[3, 5 / 5]}>
                <Flex alignItems={'center'} flexDirection={'column'}>
                  <H1 center>
                    {strings.paper.empty.headline}
                  </H1>
                  <Paragraph center>
                    {strings.paper.empty.description}
                  </Paragraph>
                  <Spacer y="l">
                    <Flex alignItems={'flex'} flexDirection={'column'}>
                      <PrimaryButton
                        onClick={() => history.push('/paper/createBriefing')}>{strings.paper.empty.createBriefing}
                      </PrimaryButton>
                    </Flex>
                  </Spacer>
                </Flex>
              </Box>
            </Flex>
          </Container>
        ) : null
        }
      </div>
    </Template>
  )
}
