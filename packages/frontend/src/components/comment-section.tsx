import React from 'react'
import { useForm } from 'react-hook-form'

import { ErrorText, Input, Spacer, StyledTextInputLabel } from '@lara/components'

import { Comment, PaperComment, UserInterface } from '../graphql'
import strings from '../locales/localization'
import CommentBox from './comment-box'

type TransformedCommentArray =
  | Array<
      Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      }
    >
  | Array<Pick<PaperComment, 'text' | 'published' | 'lastName' | 'firstName' | 'userId'>>

interface CommentSectionProps {
  comments: TransformedCommentArray
  onSubmit: onSubmitType
  displayTextInput: boolean
  bottomSpace?: boolean
  spacingM?: boolean
  updateMessage?: (message: string, commentId: string) => void
}

type onSubmitType = (comment: string) => void

const CommentSection: React.FunctionComponent<CommentSectionProps> = ({
  comments,
  bottomSpace,
  displayTextInput,
  spacingM,
  onSubmit: submit,
  updateMessage,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<{ comment: string }>()

  const onSubmit = handleSubmit((formData) => {
    if (formData.comment.trim() === '') return
    submit(formData.comment)
    void setValue('comment', '')
  })

  return (
    <>
      <CommentBox comments={comments} updateMessage={updateMessage} />
      {displayTextInput && (
        <Spacer x={spacingM ? 'm' : 'l'} bottom={bottomSpace ? 'l' : undefined}>
          <form onSubmit={onSubmit} onBlur={onSubmit}>
            <StyledTextInputLabel valid={!errors.comment}>{strings.report.comments.addComment}</StyledTextInputLabel>
            <Input
              error={Boolean(errors.comment)}
              {...register('comment', {
                minLength: {
                  value: 3,
                  message: strings.formatString(strings.validation.minLength, 3) as string,
                },
              })}
              block
            />
            {errors.comment && <ErrorText>{errors.comment.message}</ErrorText>}
          </form>
        </Spacer>
      )}
    </>
  )
}

export default CommentSection
