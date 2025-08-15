import React from 'react'
import { RouteComponentProps } from 'react-router'

import { Container, H1, H2, Paragraph, Spacer, StyledAction, StyledIcon, StyledName, Text } from '@lara/components'
import { Box, Flex } from '@rebass/grid'

import { PrimaryButton, SecondaryButton } from '../components/button'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import EmptyPaper from '../assets/illustrations/empty-paper'
import { Trainer, useDeletePaperMutation, useTrainerPaperPageDataQuery } from '../graphql'
import Loader from '../components/loader'
import ProgressBar from '../components/progress-bar'
import Avatar from '../components/avatar'
import { GraphQLError } from 'graphql/index'
import { useToastContext } from '../hooks/use-toast-context'
import PaperModal from '../assets/illustrations/paper-modal-illustraion'
import Modal from '../components/modal'
import { Paper } from '@lara/api'

export const TrainerPaperPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { loading, data } = useTrainerPaperPageDataQuery()
  const [showDeletePaperModal, setShowDeletePaperModal] = React.useState(false)
  const [toDeletePaper, setToDeletePaper] = React.useState<Paper | undefined>(undefined)

  const [deletePaper] = useDeletePaperMutation()
  const { addToast } = useToastContext()
  const toggleDeletePaperModal = (paper: Paper | undefined) => {
    setShowDeletePaperModal(!showDeletePaperModal)
    setToDeletePaper(paper)
  }

  if (!data) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  const currentUser = data?.currentUser as Trainer

  if (!currentUser) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  const handleDelete = async (paperId: string | undefined) => {
    if (!paperId) return
    await deletePaper({
      variables: {
        paperId,
      },
      updateQueries: {
        TrainerPaperPageData: (prevData, { mutationResult }) => {
          return {
            currentUser: {
              ...prevData,
              papers: mutationResult.data?.deletePaper,
            },
          }
        },
      },
    })
      .then(() => {
        addToast({
          icon: 'Bulb',
          title: strings.paper.deletePaper.title,
          text: strings.paper.deletePaper.text,
          type: 'success',
        })
        toggleDeletePaperModal(undefined)
      })
      .catch((exception: GraphQLError) => {
        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })
      })
  }

  const navigateToEditPaperPage = (paperId: string) => {
    history.push('/paper/briefing/' + paperId)
  }

  return (
    <Template type="Main">
      {loading && <Loader />}
      <div key={currentUser.id}>
        {!loading && currentUser?.papers && currentUser?.papers?.length >= 1 ? (
          currentUser?.papers?.map((paper) =>
            paper?.trainerId == currentUser.id || paper?.mentorId == currentUser.id ? (
              <Spacer bottom="xl" key={paper?.id}>
                <Container overflow={'visible'} padding={'l'} key={paper?.id}>
                  <Flex alignItems={'flex-start'} flexDirection={'row'}>
                    <Box width={[3, 5 / 5]}>
                      <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <H1 center>{strings.paper.dashboard.title + ' ' + paper?.client + ' - ' + paper?.subject}</H1>
                        {paper?.mentorId != currentUser.id ? (
                          <StyledAction onClick={() => toggleDeletePaperModal(paper)} danger noMargin={true}>
                            <StyledIcon name={'Trash'} size={'30px'} color={'errorRed'} />
                          </StyledAction>
                        ) : null}
                      </Flex>
                      <Flex alignItems={'center'} flexDirection={'column'}>
                        {currentUser?.trainees?.map((trainee) =>
                          trainee.id == paper?.traineeId ? (
                            <Flex alignItems={'center'} justifyContent={'flex-start'} key={trainee.id}>
                              <Text size={'copy'}>{strings.paper.dashboard.trainee}:</Text>
                              <StyledName>
                                {trainee.firstName} {trainee.lastName}
                              </StyledName>
                              <Avatar size={44} image={trainee.avatar} />
                            </Flex>
                          ) : null
                        )}
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
                  {!paper.briefing.length ? (
                    <Flex justifyContent={'flex-end'}>
                      <Spacer y="xl">
                        <PrimaryButton onClick={() => navigateToEditPaperPage(paper.id)}>
                          {strings.paper.dashboard.editPaper}
                        </PrimaryButton>
                      </Spacer>
                    </Flex>
                  ) : null}
                  <Modal show={showDeletePaperModal} customClose handleClose={() => toggleDeletePaperModal(undefined)}>
                    <Flex flexDirection={'row'} alignItems={'center'}>
                      <Box width={1 / 3}>
                        <PaperModal />
                      </Box>
                      <Box width={2 / 3}>
                        <H2>
                          {
                            strings.formatString(strings.paper.modal.deletePaperTitle, {
                              kunde: toDeletePaper?.client ?? '',
                            }) as string
                          }
                        </H2>
                        <Paragraph>
                          {
                            strings.formatString(strings.paper.modal.deletePaperDescription, {
                              kunde: toDeletePaper?.client ?? '',
                            }) as string
                          }
                        </Paragraph>
                        <Flex my={'2'} flexDirection={'row'} justifyContent={'space-between'}>
                          <SecondaryButton onClick={() => toggleDeletePaperModal(undefined)}>
                            {strings.paper.modal.deletePaperButtonDisagree}
                          </SecondaryButton>

                          <PrimaryButton onClick={() => handleDelete(toDeletePaper?.id)} danger>
                            {strings.paper.modal.deletePaperButtonAgree}
                          </PrimaryButton>
                        </Flex>
                      </Box>
                    </Flex>
                  </Modal>
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
                  <PrimaryButton onClick={() => history.push('/paper/createBriefing')}>
                    {strings.paper.empty.createBriefing}
                  </PrimaryButton>
                </Flex>
              </Spacer>
              <EmptyPaper />
            </Box>
          </Flex>
        )}
        {currentUser?.papers && currentUser?.papers?.length >= 1 ? (
          <Container overflow={'visible'} padding={'l'}>
            <Flex alignItems={'center'} flexDirection={'row'}>
              <EmptyPaper />
              <Box width={[3, 5 / 5]}>
                <Flex alignItems={'center'} flexDirection={'column'}>
                  <H1 center>{strings.paper.empty.headline}</H1>
                  <Paragraph center>{strings.paper.empty.description}</Paragraph>
                  <Spacer y="l">
                    <Flex alignItems={'flex'} flexDirection={'column'}>
                      <PrimaryButton onClick={() => history.push('/paper/createBriefing')}>
                        {strings.paper.empty.createBriefing}
                      </PrimaryButton>
                    </Flex>
                  </Spacer>
                </Flex>
              </Box>
            </Flex>
          </Container>
        ) : null}
      </div>
    </Template>
  )
}
