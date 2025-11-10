import React from 'react'
import { useParams } from 'react-router'
import { Box, Container, PaperH2, PaperLayout, Spacer, Spacings } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import { Template } from '../templates/template'
import strings from '../locales/localization'

import { PaperFormData, useUpdatePaperMutation, useFeedbackDiscussionPageDataQuery } from '../graphql'
import { omitDeep } from '@apollo/client/utilities'
import CommentSection from '../components/comment-section'
import { styled } from 'styled-components'

export const PaperTextQuestion = styled.p`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: 600;
  padding: ${Spacings.m};
  font-size: 16px;
  color: ${(props) => props.theme.mediumFont};
  line-height: 1.2;
`

export const PaperTextHint = styled.p`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  padding: ${Spacings.m};
  font-size: 16px;
  color: ${(props) => props.theme.mediumFont};
  line-height: 100%;
`

export const PaperText = styled.p`
  margin: ${Spacings.m};
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 16px;
  padding-bottom: 12px;
  color: ${(props) => props.theme.mediumFont};
  line-height: 100%;
  border-bottom: 1px solid black;
`

interface FeedbackEntryProps {
  entry: PaperFormData
  onSubmit: (comment: string) => void
  displayTextInput: boolean
}

export const FeedbackEntry: React.FC<FeedbackEntryProps> = ({ entry, onSubmit, displayTextInput }) => {
  return (
    <Box mb="4" p="4">
      <Box mb="3">
        <PaperTextQuestion>{entry.question}</PaperTextQuestion>
        <PaperTextHint>{entry.hint}</PaperTextHint>
        <PaperText>{entry.answer}</PaperText>
      </Box>

      <CommentSection
        spacingM={true}
        comments={entry.comments}
        onSubmit={onSubmit}
        displayTextInput={displayTextInput}
      />
    </Box>
  )
}

export const PaperFeedbackDiscussionPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  const data = useFeedbackDiscussionPageDataQuery()

  const currentUser =
    data.data?.currentUser?.__typename === 'Mentor' || data.data?.currentUser?.__typename === 'Trainee'
      ? data.data.currentUser
      : undefined

  const papers = currentUser?.papers

  const paper = papers?.find((p) => String(p?.id) === String(paperId))

  const [updatePaper] = useUpdatePaperMutation()

  console.log('current user: ', currentUser)
  console.log('paper: ', paper)
  console.log('papers: ', papers)

  if (!paper || !currentUser) {
    return (
      <Template type="Main">
        <PaperText>Loading...</PaperText>
      </Template>
    )
  }

  const handleCommentSubmit = async (side: 'trainee' | 'mentor', entryId: string, text: string) => {
    const t = text?.trim()
    if (!t) return

    const newComment = {
      text: t,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      userId: currentUser.id,
      published: true,
    }

    const nextTrainee: PaperFormData[] = (paper.feedbackTrainee ?? []).map((e) =>
      e.id === entryId && side === 'trainee'
        ? {
            ...e,
            comments: [...e.comments, newComment],
          }
        : e
    )

    const nextMentor: PaperFormData[] = (paper.feedbackMentor ?? []).map((e) =>
      e.id === entryId && side === 'mentor'
        ? {
            ...e,
            comments: [...e.comments, newComment],
          }
        : e
    )

    await updatePaper({
      variables: {
        input: {
          id: paper.id,
          traineeId: paper.traineeId ?? '',
          mentorId: paper.mentorId ?? '',
          trainerId: paper.trainerId ?? '',
          client: paper.client ?? '',
          subject: paper.subject ?? '',
          periodStart: paper.periodStart,
          periodEnd: paper.periodEnd,
          schoolPeriodStart: paper.schoolPeriodStart,
          schoolPeriodEnd: paper.schoolPeriodEnd,
          status: paper.status,
          briefing: omitDeep(paper.briefing ?? [], '__typename'),
          feedbackTrainee: omitDeep(nextTrainee, '__typename'),
          feedbackMentor: omitDeep(nextMentor, '__typename'),
        },
      },
      refetchQueries: ['TraineePaperPageData', 'MentorPaperPageData'],
    })
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
        <PaperH2>{strings.paper.feedback.headlineEvaluationByTrainee}</PaperH2>
      </Spacer>
      <Container>
        <PaperLayout>
          <div style={{ width: '100%' }}>
            {Array.isArray(paper.feedbackTrainee) &&
              paper.feedbackTrainee.map((entry: PaperFormData) => (
                <FeedbackEntry
                  key={entry.id}
                  entry={entry}
                  onSubmit={(text) => handleCommentSubmit('trainee', entry.id, text)}
                  displayTextInput={true}
                />
              ))}
          </div>
        </PaperLayout>
      </Container>
      <PaperH2>{strings.paper.feedback.headlineEvaluationByMentor}</PaperH2>
      <Container>
        <PaperLayout>
          <div style={{ width: '100%' }}>
            {Array.isArray(paper.feedbackMentor) &&
              paper.feedbackMentor.map((entry: PaperFormData) => (
                <FeedbackEntry
                  key={entry.id}
                  entry={entry}
                  onSubmit={(text) => handleCommentSubmit('mentor', entry.id, text)}
                  displayTextInput={true}
                />
              ))}
          </div>
        </PaperLayout>
      </Container>
    </Template>
  )
}

export default PaperFeedbackDiscussionPage
