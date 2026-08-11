import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input, Text, TextProps, DefaultTheme, Spacer, StyledSelect } from '@lara/components'

import strings from '../locales/localization'
import { PrimaryButton } from './button'
import { useValidationHelper } from '../helper/validation-helper'
import { Trainer, useUserEmailPageMutation } from '../graphql'
import { CreateBriefingLayout } from '@lara/components/lib/paper-form'

interface CreateBriefingFormProps {
  trainer?: Trainer
  submit: (data: CreateBriefingFormData) => Promise<void>
  blurSubmit: boolean
  initialData?: Partial<CreateBriefingFormData>
  submitButtonLabel?: string
  isEditMode?: boolean
}

export interface CreateBriefingFormData {
  trainee: string
  firstNameMentor: string
  lastNameMentor: string
  emailMentor: string
  customer: string
  startDateProject: string
  endDateProject: string
  startDateSchool: string
  endDateSchool: string
  department: string
}

const inputLabelProps: TextProps = {
  spacing: '1.2px',
  weight: 700,
  size: 'label',
  uppercase: true,
}

const formatDateForInput = (date?: string) => {
  if (!date) return ''
  return date.includes('T') ? date.split('T')[0] : date
}

export const PaperCreateForm: React.FC<CreateBriefingFormProps> = ({
  trainer,
  submit,
  blurSubmit,
  initialData,
  submitButtonLabel,
  isEditMode,
}) => {
  const { validateEmail } = useValidationHelper()
  const [getUserByEmail] = useUserEmailPageMutation()
  const [nameInputDisabled, setNameInputDisabled] = useState(false)
  const [updating, setUpdating] = React.useState(false)

  const currentUser = trainer

  const defaultFormValues = useMemo<CreateBriefingFormData>(
    () => ({
      trainee: initialData?.trainee ?? currentUser?.trainees?.[0]?.id ?? '',
      firstNameMentor: initialData?.firstNameMentor ?? '',
      lastNameMentor: initialData?.lastNameMentor ?? '',
      emailMentor: initialData?.emailMentor ?? '',
      customer: initialData?.customer ?? '',
      startDateProject: formatDateForInput(initialData?.startDateProject),
      endDateProject: formatDateForInput(initialData?.endDateProject),
      startDateSchool: formatDateForInput(initialData?.startDateSchool),
      endDateSchool: formatDateForInput(initialData?.endDateSchool),
      department: initialData?.department ?? '',
    }),
    [initialData, currentUser]
  )

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBriefingFormData>({
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    reset(defaultFormValues)
  }, [])

  const onSubmit = handleSubmit((formdata) => {
    setUpdating(true)
    submit(formdata).finally(() => {
      setUpdating(false)
    })
  })

  const getFontColor = (hasError: unknown): keyof DefaultTheme => (hasError ? 'errorRed' : 'darkFont')

  return (
    <form onSubmit={onSubmit}>
      <CreateBriefingLayout
        traineeInput={
          <>
            <Text color={getFontColor(errors.trainee)} {...inputLabelProps}>
              {strings.paper.createBriefing.trainee}
            </Text>
            <StyledSelect
              {...register('trainee', { required: strings.validation.required })}
              defaultValue={defaultFormValues.trainee}
              disabled={updating}
              onChange={blurSubmit ? onSubmit : undefined}
            >
              {currentUser?.trainees.map((trainee, index) => {
                return (
                  <option value={trainee.id} key={index}>
                    {trainee.firstName} {trainee.lastName}
                  </option>
                )
              })}
            </StyledSelect>
          </>
        }
        emailMentorInput={
          <>
            <Text color={getFontColor(errors.emailMentor)} {...inputLabelProps}>
              {strings.paper.createBriefing.emailMentor}
            </Text>
            <Input
              type="email"
              defaultValue={defaultFormValues.emailMentor}
              {...register('emailMentor', {
                required: !isEditMode,
                validate: (value) => {
                  if (isEditMode && !value) return true
                  return validateEmail(value)
                },
              })}
              disabled={updating}
              error={Boolean(errors.emailMentor)}
              onBlur={async (e) => {
                if (e.target.value.trim() === '') {
                  setNameInputDisabled(false)
                  return
                }

                await getUserByEmail({
                  variables: {
                    email: e.target.value,
                  },
                }).then((response) => {
                  if (response.data?.getUserByEmail) {
                    setValue('firstNameMentor', response.data.getUserByEmail.firstName, { shouldValidate: true })
                    setValue('lastNameMentor', response.data.getUserByEmail.lastName, { shouldValidate: true })
                    setNameInputDisabled(true)
                  } else {
                    setNameInputDisabled(false)
                  }
                })

                if (blurSubmit) onSubmit()
              }}
            />
          </>
        }
        firstNameMentorInput={
          <>
            <Text color={getFontColor(errors.firstNameMentor)} {...inputLabelProps}>
              {strings.paper.createBriefing.firstnameMentor}
            </Text>
            <Input
              defaultValue={defaultFormValues.firstNameMentor}
              {...register('firstNameMentor', {
                required: !isEditMode ? strings.validation.required : false,
              })}
              disabled={updating || nameInputDisabled}
              error={Boolean(errors.firstNameMentor)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        emptyFieldTrainee={<></>}
        lastNameMentorInput={
          <>
            <Text color={getFontColor(errors.lastNameMentor)} {...inputLabelProps}>
              {strings.paper.createBriefing.lastnameMentor}
            </Text>
            <Input
              defaultValue={defaultFormValues.lastNameMentor}
              {...register('lastNameMentor', {
                required: !isEditMode ? strings.validation.required : false,
              })}
              disabled={updating || nameInputDisabled}
              error={Boolean(errors.lastNameMentor)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        emptyFieldMentor={<></>}
        customerInput={
          <>
            <Spacer bottom="m">
              <Text {...inputLabelProps} color={getFontColor(errors.customer)} weight={700}>
                {strings.paper.createBriefing.customer}
              </Text>
              <Input
                type="text"
                defaultValue={defaultFormValues.customer}
                {...register('customer', {
                  required: true,
                })}
                disabled={updating}
                error={Boolean(errors.customer)}
                onBlur={blurSubmit ? onSubmit : undefined}
              />
            </Spacer>
          </>
        }
        startDateProjectInput={
          <>
            <Text color={getFontColor(errors.startDateProject || errors.endDateProject)} {...inputLabelProps}>
              {strings.paper.createBriefing.projectPeriod}
            </Text>
            <Input
              type="date"
              defaultValue={defaultFormValues.startDateProject}
              {...register('startDateProject', {})}
              block
              disabled={updating}
              error={Boolean(errors.startDateProject)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        periodProjectSpacer={
          <Text color="darkFont" size="copy">
            {strings.periodTo}
          </Text>
        }
        endDateProjectInput={
          <>
            <Input
              type="date"
              defaultValue={defaultFormValues.endDateProject}
              {...register('endDateProject', {})}
              block
              disabled={updating}
              error={Boolean(errors.endDateProject)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        startDateSchoolInput={
          <>
            <Text color={getFontColor(errors.startDateSchool || errors.endDateSchool)} {...inputLabelProps}>
              {strings.paper.createBriefing.schoolPeriod}
            </Text>
            <Input
              type="date"
              defaultValue={defaultFormValues.startDateSchool}
              {...register('startDateSchool', {})}
              block
              disabled={updating}
              error={Boolean(errors.startDateSchool)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        periodSchoolSpacer={
          <Text color="darkFont" size="copy">
            {strings.periodTo}
          </Text>
        }
        endDateSchoolInput={
          <>
            <Input
              type="date"
              defaultValue={defaultFormValues.endDateSchool}
              {...register('endDateSchool', {})}
              block
              disabled={updating}
              error={Boolean(errors.endDateSchool)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        departmentInput={
          <>
            <Spacer bottom="m">
              <Text {...inputLabelProps} color={getFontColor(errors.department)} weight={700}>
                {strings.paper.createBriefing.department}
              </Text>
              <Input
                type="text"
                defaultValue={defaultFormValues.department}
                {...register('department', {
                  required: true,
                })}
                disabled={updating}
                error={Boolean(errors.department)}
                onBlur={blurSubmit ? onSubmit : undefined}
              />
            </Spacer>
          </>
        }
        buttonControls={
          !blurSubmit ? (
            <>
              <PrimaryButton type="submit" disabled={updating}>
                {submitButtonLabel ?? strings.continue}
              </PrimaryButton>
            </>
          ) : undefined
        }
      />
    </form>
  )
}
