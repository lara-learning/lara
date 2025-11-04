import React from 'react'
import { useParams } from 'react-router'
import { Box, PaperH2, PaperLayout, Spacer } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import { Template } from '../templates/template'
import strings from '../locales/localization'

import { PaperFormData, useUpdatePaperMutation, useFeedbackDiscussionPageDataQuery } from '../graphql'
import { omitDeep } from '@apollo/client/utilities'
import CommentSection from '../components/comment-section'

interface FeedbackEntryProps {
  entry: PaperFormData
  comments: string[]
  onSubmit: (comment: string) => void
  displayTextInput: boolean
}

// FeedbackEntryProps already declares:
// { entry: PaperFormData; comments: string[]; onSubmit: (comment: string) => void; displayTextInput: boolean }

export const FeedbackEntry: React.FC<FeedbackEntryProps> = ({ entry, comments, onSubmit, displayTextInput }) => {
  // If CommentSection expects richer objects, convert at boundary (kept minimal)
  const commentSectionData = (comments || []).map((text, i) => ({
    id: `generated-${i}`,
    text,
    published: true,
    user: {
      id: 'unknown',
      firstName: '',
      lastName: '',
    },
  }))

  console.log('here')

  return (
    <Box mb="4" p="4">
      <Box mb="3">
        <strong>{entry.question}</strong>
        <p>{entry.answer}</p>
      </Box>

      <CommentSection comments={commentSectionData} onSubmit={onSubmit} displayTextInput={displayTextInput} />
    </Box>
  )
}

/**
 * Keep minimal changes: type the currentUser->papers access so we can call .map
 * with concrete PaperFormData elements instead of `any`.
 */
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
        <div>Loading...</div>
      </Template>
    )
  }

  // read comments from entry if present, else empty
  const getCommentsForEntry = (entry: PaperFormData): string[] => {
    return (entry.comments as string[]) || []
  }

  // Save a new comment into the correct side and persist via updatePaperMutation
  const handleCommentSubmit = async (side: 'trainee' | 'mentor', entryId: string, text: string) => {
    const t = text?.trim()
    if (!t) return

    const nextTrainee: PaperFormData[] = (paper.feedbackTrainee ?? []).map((e) =>
      e.id === entryId && side === 'trainee' ? { ...e, comments: [...(e.comments ?? []), t] } : { ...e, comments: [] }
    )

    const nextMentor: PaperFormData[] = (paper.feedbackMentor ?? []).map((e) =>
      e.id === entryId && side === 'mentor' ? { ...e, comments: [...(e.comments ?? []), t] } : { ...e, comments: [] }
    )

    console.log('mentor and trainee: ')
    console.log(nextTrainee)
    console.log(nextMentor)

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
      </Spacer>
      <PaperLayout>
        <div style={{ width: '100%' }}>
          <PaperH2>{strings.paper.feedback.headlineEvaluationByTrainee}</PaperH2>

          {Array.isArray(paper.feedbackTrainee) &&
            paper.feedbackTrainee.map((entry: PaperFormData) => (
              <FeedbackEntry
                key={entry.id}
                entry={entry}
                comments={getCommentsForEntry(entry)}
                onSubmit={(text) => handleCommentSubmit('trainee', entry.id, text)}
                displayTextInput={true}
              />
            ))}

          <PaperH2>{strings.paper.feedback.headlineEvaluationByMentor}</PaperH2>

          {Array.isArray(paper.feedbackMentor) &&
            paper.feedbackMentor.map((entry: PaperFormData) => (
              <FeedbackEntry
                key={entry.id}
                entry={entry}
                comments={getCommentsForEntry(entry)}
                onSubmit={(text) => handleCommentSubmit('mentor', entry.id, text)}
                displayTextInput={true}
              />
            ))}
        </div>
      </PaperLayout>
    </Template>
  )
}

export default PaperFeedbackDiscussionPage
