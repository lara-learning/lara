import React from 'react'
import { useParams } from 'react-router'
import { Box, PaperH2, PaperLayout, Spacer } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import { Template } from '../templates/template'
import strings from '../locales/localization'
import {
  useTraineePaperPageDataQuery,
  useMentorPaperPageDataQuery,
  FeedbackEntryProps,
  PaperFormData,
} from '../graphql'
import CommentSection from '../components/comment-section'

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

type PaperWithFeedback = {
  id: string
  feedbackTrainee?: PaperFormData[]
  feedbackMentor?: PaperFormData[]
}

/**
 * Keep minimal changes: type the currentUser->papers access so we can call .map
 * with concrete PaperFormData elements instead of `any`.
 */
export const PaperFeedbackDiscussionPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  const traineePaperData = useTraineePaperPageDataQuery()
  const mentorPaperData = useMentorPaperPageDataQuery()

  const currentUser = traineePaperData.data?.currentUser || mentorPaperData.data?.currentUser

  // Narrow `papers` to a known shape (no `any`)
  const papers = (currentUser as unknown as { papers?: PaperWithFeedback[] })?.papers
  const paper = papers?.find((p) => p.id === paperId)

  if (!paper || !currentUser) {
    return (
      <Template type="Main">
        <div>Loading...</div>
      </Template>
    )
  }

  // keep returning string[] as per FeedbackEntryProps
  const getCommentsForEntry = (_entryId: string): string[] => {
    return []
  }

  // prefix unused args with _ to satisfy eslint no-unused-vars rule
  const handleCommentSubmit = (_entryId: string, _text: string) => {
    // TODO: Implement mutation to save comment for entry
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
                comments={getCommentsForEntry(entry.id)}
                onSubmit={(text) => handleCommentSubmit(entry.id, text)}
                displayTextInput={true}
              />
            ))}

          <PaperH2>{strings.paper.feedback.headlineEvaluationByMentor}</PaperH2>

          {Array.isArray(paper.feedbackMentor) &&
            paper.feedbackMentor.map((entry: PaperFormData) => (
              <FeedbackEntry
                key={entry.id}
                entry={entry}
                comments={getCommentsForEntry(entry.id)}
                onSubmit={(text) => handleCommentSubmit(entry.id, text)}
                displayTextInput={true}
              />
            ))}
        </div>
      </PaperLayout>
    </Template>
  )
}

export default PaperFeedbackDiscussionPage
