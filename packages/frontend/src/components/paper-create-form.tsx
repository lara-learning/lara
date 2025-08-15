import React from 'react'
import { useForm } from 'react-hook-form'
import { Input, Text, TextProps, DefaultTheme, Spacer, StyledSelect } from '@lara/components'

import strings from '../locales/localization'
import { PrimaryButton } from './button'
import { useValidationHelper } from '../helper/validation-helper'
import { Trainer } from '../graphql'
import { CreateBriefingLayout } from '@lara/components/lib/paper-form'

interface CreateBriefingFormProps {
  trainer?: Trainer
  submit: (data: CreateBriefingFormData) => Promise<void>
  blurSubmit: boolean
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

export const PaperCreateForm: React.FC<CreateBriefingFormProps> = ({ trainer, submit, blurSubmit }) => {
  const { validateEmail } = useValidationHelper()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBriefingFormData>()

  const onSubmit = handleSubmit((formdata) => {
    setUpdating(true)
    submit(formdata).then(() => {
      setUpdating(false)
    })
  })

  const [updating, setUpdating] = React.useState(false)
  const currentUser = trainer
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
              defaultValue={currentUser?.trainees.length ? currentUser?.trainees[0].id : ''}
              disabled={updating}
              onChange={onSubmit}
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
        firstNameMentorInput={
          <>
            <Text color={getFontColor(errors.firstNameMentor)} {...inputLabelProps}>
              {strings.paper.createBriefing.firstnameMentor}
            </Text>
            <Input
              {...register('firstNameMentor', {
                required: strings.validation.required,
              })}
              disabled={updating}
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
              {...register('lastNameMentor', {
                required: strings.validation.required,
              })}
              disabled={updating}
              error={Boolean(errors.lastNameMentor)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        emailMentorInput={
          <>
            <Text color={getFontColor(errors.emailMentor)} {...inputLabelProps}>
              {strings.paper.createBriefing.emailMentor}
            </Text>
            <Input
              type="email"
              {...register('emailMentor', {
                required: true,
                validate: validateEmail,
              })}
              disabled={updating}
              error={Boolean(errors.emailMentor)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        emptyFieldMentor={<></>}
        customerInput={
          <>
            <Spacer bottom="m">
              <Text {...inputLabelProps} color="darkFont" weight={700}>
                {strings.paper.createBriefing.customer}
              </Text>
              <Input
                type="text"
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
            <Text color={getFontColor(errors.startDateProject || errors.startDateProject)} {...inputLabelProps}>
              {strings.paper.createBriefing.projectPeriod}
            </Text>
            <Input
              type="date"
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
              <Text {...inputLabelProps} color="darkFont" weight={700}>
                {strings.paper.createBriefing.department}
              </Text>
              <Input
                type="text"
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
