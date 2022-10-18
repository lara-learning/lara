import { GraphQLError } from 'graphql'
import React from 'react'
import { useForm } from 'react-hook-form'

import {
  ErrorText,
  Input,
  Paragraph,
  Spacer,
  StyledIcon,
  StyledSettingsGrid,
  StyledSettingsTrainerGrid,
  StyledTextInputLabel,
} from '@lara/components'

import { useTraineeSettingsDataQuery, useTraineeSettingsUpdateTraineeMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import Avatar from './avatar'
import Loader from './loader'

interface TraineeSettingsFormData {
  course: string
}

type TraineeSettingsProps = {
  disableUIFeedback?: boolean
}

const TraineeSettings: React.FunctionComponent<TraineeSettingsProps> = ({ disableUIFeedback }) => {
  const { loading, data } = useTraineeSettingsDataQuery()

  const [mutate] = useTraineeSettingsUpdateTraineeMutation()
  const { addToast } = useToastContext()

  const [updating, setUpdating] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TraineeSettingsFormData>()

  if (loading || !data) {
    return <Loader size="56px" padding="56px" />
  }

  const { currentUser } = data

  if (!currentUser || currentUser.__typename !== 'Trainee') {
    return null
  }

  const onSubmit = handleSubmit((formData) => {
    if (formData.course === currentUser.course) {
      return
    }

    if (!disableUIFeedback) {
      setUpdating(true)
    }

    mutate({
      variables: {
        ...formData,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCurrentTrainee: {
          ...currentUser,
          ...formData,
        },
      },
    })
      .then(() => {
        if (disableUIFeedback) return

        addToast({
          icon: 'Settings',
          title: strings.settings.saveSuccessTitle,
          text: strings.settings.saveSuccess,
          type: 'success',
        })

        setUpdating(false)
      })
      .catch((exception: GraphQLError) => {
        if (disableUIFeedback) return

        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })

        setUpdating(false)
      })
  })

  return (
    <form onSubmit={onSubmit}>
      <StyledSettingsGrid>
        <div>
          <StyledTextInputLabel valid={!errors.course}>{strings.course}</StyledTextInputLabel>
          <Input
            {...register('course', {
              required: strings.validation.required,
              maxLength: { value: 64, message: strings.formatString(strings.validation.maxLength, 64) as string },
              minLength: { value: 2, message: strings.formatString(strings.validation.minLength, 2) as string },
            })}
            block
            defaultValue={currentUser.course}
            disabled={updating}
            error={Boolean(errors.course)}
            onBlur={onSubmit}
          />
          {errors.course && <ErrorText>{errors.course.message}</ErrorText>}
        </div>
        <div>
          <StyledTextInputLabel valid={true}>{strings.settings.trainer}</StyledTextInputLabel>
          <StyledSettingsTrainerGrid>
            <Spacer right="m">
              {currentUser.trainer ? (
                /* Display actual avatar of assigned trainer */
                <Avatar size={50} image={currentUser.trainer.avatar} />
              ) : (
                /* Display a placeholder */
                <StyledIcon size="35px" name={'Profile'} />
              )}
            </Spacer>
            <Paragraph color="darkFont">
              {currentUser.trainer
                ? `${currentUser.trainer.firstName} ${currentUser.trainer.lastName}`
                : strings.settings.noTrainer}
            </Paragraph>
          </StyledSettingsTrainerGrid>
        </div>
      </StyledSettingsGrid>
    </form>
  )
}

export default TraineeSettings
