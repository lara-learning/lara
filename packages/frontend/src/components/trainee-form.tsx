import { format, parseISO } from 'date-fns'
import React from 'react'
import { useForm } from 'react-hook-form'

import { DefaultTheme, Input, Spacer, StyledSelect, Text, TextProps, TraineeFormLayout } from '@lara/components'

import { Company, Trainee } from '../graphql'
import { useValidationHelper } from '../helper/validation-helper'
import strings from '../locales/localization'
import { PrimaryButton, SecondaryButton } from './button'
import { useFormToasts } from '../hooks/use-form-toast'

interface EditTraineeFormProps {
  trainee?: Pick<
    Trainee,
    'firstName' | 'lastName' | 'email' | 'startDate' | 'endDate' | 'startOfToolUsage' | 'course'
  > & {
    company: Pick<Company, 'id'>
  }
  companies: Pick<Company, 'id' | 'name'>[]
  submit: (data: EditTraineeFormData) => Promise<void>
  cancel?: () => void
  blurSubmit: boolean
}

export interface EditTraineeFormData {
  firstName: string
  lastName: string
  email: string
  startDate: string
  endDate: string
  startOfToolUsage: string
  companyId: string
}

const inputLabelProps: TextProps = {
  spacing: '1.2px',
  weight: 700,
  size: 'label',
  uppercase: true,
}

export const TraineeForm: React.FC<EditTraineeFormProps> = ({ trainee, companies, submit, blurSubmit, cancel }) => {
  const { validateEmail, validateStartDate, validateEndDate } = useValidationHelper()

  const { register, handleSubmit, reset, formState } = useForm<EditTraineeFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  })

  const { errors } = formState

  useFormToasts(formState)

  const onSubmit = handleSubmit((formdata) => {
    setUpdating(true)

    submit(formdata).then(() => setUpdating(false))
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
      <TraineeFormLayout
        firstNameInput={
          <>
            <Text color={getFontColor(errors.firstName)} {...inputLabelProps}>
              {strings.settings.firstname}
            </Text>
            <Input
              {...register('firstName', { required: strings.validation.required })}
              defaultValue={trainee?.firstName}
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
              {...register('lastName', { required: strings.validation.required })}
              defaultValue={trainee?.lastName}
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
              {...register('email', { required: true, validate: validateEmail })}
              defaultValue={trainee?.email}
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
              defaultValue={trainee?.startDate && format(parseISO(trainee.startDate), 'yyyy-MM-dd')}
              {...(trainee?.endDate
                ? register('startDate', {
                    required: strings.validation.required,
                    max: { value: trainee.endDate, message: strings.validation.dateBefore },
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
              defaultValue={trainee?.endDate && format(parseISO(trainee.endDate), 'yyyy-MM-dd')}
              {...(trainee?.startDate
                ? register('endDate', {
                    required: strings.validation.required,
                    min: { value: trainee.startDate, message: strings.validation.dateAfter },
                    validate: validateEndDate,
                  })
                : register('endDate', { required: strings.validation.required, validate: validateEndDate }))}
              error={Boolean(errors.endDate)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        companyInput={
          <>
            <Text color={getFontColor(errors.companyId)} {...inputLabelProps}>
              {strings.company}
            </Text>
            <StyledSelect
              {...register('companyId', { required: strings.validation.required })}
              defaultValue={trainee?.company.id}
              disabled={updating}
              onChange={onSubmit}
            >
              {companies.map((comp, i) => {
                return (
                  <option value={comp.id} key={i}>
                    {comp.name}
                  </option>
                )
              })}
            </StyledSelect>
          </>
        }
        startOfToolUsageInput={
          <>
            <Text color={getFontColor(errors.startOfToolUsage)} {...inputLabelProps}>
              {strings.settings.startOfToolusage}
            </Text>
            <Input
              type="date"
              block
              disabled={updating}
              defaultValue={trainee?.startOfToolUsage && format(parseISO(trainee.startOfToolUsage), 'yyyy-MM-dd')}
              {...(trainee?.startDate
                ? register('startOfToolUsage', {
                    min: {
                      value: trainee.startDate,
                      message: strings.validation.dateAfter,
                    },
                  })
                : register('startOfToolUsage', { required: strings.validation.required }))}
              error={Boolean(errors.startOfToolUsage)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        course={
          <>
            <Spacer bottom="m">
              <Text {...inputLabelProps} color="darkFont" weight={700}>
                {strings.course}
              </Text>
            </Spacer>
            <Text size="copy" color="darkFont">
              {trainee?.course ? trainee.course : strings.settings.notAssociated}
            </Text>
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
