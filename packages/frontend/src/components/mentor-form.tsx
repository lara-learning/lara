import React from 'react'
import { useForm } from 'react-hook-form'
import { Input, Text, TextProps, DefaultTheme, MentorFormLayout } from '@lara/components'

import strings from '../locales/localization'
import { PrimaryButton, SecondaryButton } from './button'
import { useValidationHelper } from '../helper/validation-helper'
import { format, parseISO } from 'date-fns'
import { Mentor } from '../graphql'

interface EditMentorFormProps {
  mentor?: Pick<Mentor, 'firstName' | 'lastName' | 'email' | 'startDate' | 'endDate' | 'deleteAt'>
  submit: (data: EditMentorFormData) => Promise<void>
  cancel?: () => void
  blurSubmit: boolean
}

export interface EditMentorFormData {
  firstName: string
  lastName: string
  email: string
  startDate: string
  endDate: string
  deleteAt: string
}

const inputLabelProps: TextProps = {
  spacing: '1.2px',
  weight: 700,
  size: 'label',
  uppercase: true,
}

export const MentorForm: React.FC<EditMentorFormProps> = ({ mentor, submit, blurSubmit, cancel }) => {
  const { validateEmail, validateStartDate, validateEndDate } = useValidationHelper()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditMentorFormData>()

  const onSubmit = handleSubmit((formdata) => {
    setUpdating(true)

    submit(formdata).then(() => {
      setUpdating(false)
    })
  })

  const onCancel = () => {
    reset()

    if (cancel) {
      cancel()
    }
  }

  const [updating, setUpdating] = React.useState(false)

  const getFontColor = (hasError: unknown): keyof DefaultTheme => (hasError ? 'errorRed' : 'darkFont')
  return (
    <form onSubmit={onSubmit}>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <MentorFormLayout
        firstNameInput={
          <>
            <Text color={getFontColor(errors.firstName)} {...inputLabelProps}>
              {strings.settings.firstname}
            </Text>
            <Input
              {...register('firstName', {
                required: strings.validation.required,
              })}
              defaultValue={mentor?.firstName}
              disabled={updating}
              error={Boolean(errors.firstName)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        lastNameInput={
          <>
            <Text color={getFontColor(errors.lastName)} {...inputLabelProps}>
              {strings.settings.lastname}
            </Text>
            <Input
              {...register('lastName', {
                required: strings.validation.required,
              })}
              defaultValue={mentor?.lastName}
              disabled={updating}
              error={Boolean(errors.lastName)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        emailInput={
          <>
            <Text color={getFontColor(errors.email)} {...inputLabelProps}>
              {strings.settings.email}
            </Text>
            <Input
              type="email"
              {...register('email', {
                required: true,
                validate: validateEmail,
              })}
              defaultValue={mentor?.email}
              disabled={updating}
              error={Boolean(errors.email)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        startDateInput={
          <>
            <Text color={getFontColor(errors.startDate || errors.endDate)} {...inputLabelProps}>
              {strings.period}
            </Text>
            <Input
              type="date"
              block
              disabled={updating}
              defaultValue={mentor?.startDate && format(parseISO(mentor.startDate), 'yyyy-MM-dd')}
              {...(mentor?.endDate
                ? register('startDate', {
                    required: strings.validation.required,
                    max: { value: mentor.endDate, message: strings.validation.dateBefore },
                    validate: validateStartDate,
                  })
                : register('startDate', { required: strings.validation.required, validate: validateStartDate }))}
              error={Boolean(errors.startDate)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        periodSpacer={
          <Text color="darkFont" size="copy">
            {strings.periodTo}
          </Text>
        }
        endDateInput={
          <>
            <Input
              type="date"
              block
              disabled={updating}
              defaultValue={mentor?.endDate && format(parseISO(mentor.endDate), 'yyyy-MM-dd')}
              {...(mentor?.startDate
                ? register('endDate', {
                    required: strings.validation.required,
                    min: { value: mentor.startDate, message: strings.validation.dateAfter },
                    validate: validateEndDate,
                  })
                : register('endDate', { required: strings.validation.required, validate: validateEndDate }))}
              error={Boolean(errors.endDate)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        buttonControls={
          !blurSubmit ? (
            <>
              <SecondaryButton type="button" onClick={onCancel}>
                {strings.cancel}
              </SecondaryButton>
              <PrimaryButton type="submit" onClick={onSubmit}>
                {strings.continue}
              </PrimaryButton>
            </>
          ) : undefined
        }
      />
    </form>
  )
}
