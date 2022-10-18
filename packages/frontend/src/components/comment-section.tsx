import React from 'react'
import { useForm } from 'react-hook-form'

import { ErrorText, Input, Spacer, StyledTextInputLabel } from '@lara/components'

import { Comment, UserInterface } from '../graphql'
import strings from '../locales/localization'
import CommentBox from './comment-box'

interface CommentSectionProps {
  comments: (Pick<Comment, 'id' | 'text'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName' | 'avatar'>
  })[]
  onSubmit: onSubmitType
  displayTextInput: boolean
  bottomSpace?: boolean
}

type onSubmitType = (comment: string) => void

const CommentSection: React.FunctionComponent<CommentSectionProps> = ({
  comments,
  bottomSpace,
  displayTextInput,
  onSubmit: submit,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<{ comment: string }>()

  const onSubmit = handleSubmit((formData) => {
    submit(formData.comment)
    void setValue('comment', '')
  })

  return (
    <>
      <CommentBox comments={comments} />
      {displayTextInput && (
        <Spacer x="l" bottom={bottomSpace ? 'l' : undefined}>
          <form onSubmit={onSubmit}>
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
