import React from 'react'
import {useForm} from 'react-hook-form'
import {
  Input,
  Text,
  TextProps,
  DefaultTheme,
  Spacer
} from '@lara/components'

import strings from '../locales/localization'
import {PrimaryButton} from './button'
import {useValidationHelper} from '../helper/validation-helper'
import {Mentor} from "../graphql";
import {CreateBriefingLayout} from "@lara/components/lib/paper-form";

interface CreateBriefingFormProps {
  mentor?: Pick<Mentor, 'firstName' | 'lastName' | 'email' | 'startDate' | 'endDate' | 'deleteAt'>
  submit: (data: CreateBriefingFormData) => Promise<void>
  cancel?: () => void
  blurSubmit: boolean
}

export interface CreateBriefingFormData {
  firstNameTrainee: string
  lastNameTrainee: string
  emailTrainee: string
  firstNameMentor: string
  lastNameMentor: string
  emailMentor: string
  customer: string
  //companyId: string
  startDateProjectInput: string
  endDateProjectInput: string
  startDateSchool: string
  endDateSchool: string
  department: string
}

export interface CreatePaperProps {
  trainee: string
  trainer: string
  client: string
  mentor: string
  periodStart: string
  periodEnd: string
  subject: string
  status: string
  briefing: []
}

const inputLabelProps: TextProps = {
  spacing: '1.2px',
  weight: 700,
  size: 'label',
  uppercase: true,
}

export const PaperCreateForm: React.FC<CreateBriefingFormProps> = ({
                                                                     submit,
                                                                     blurSubmit
                                                                   }) => {
  const {validateEmail} = useValidationHelper()

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<CreateBriefingFormData>()

  const onSubmit = handleSubmit((formdata) => {
    setUpdating(true)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    submit(formdata).then(() => {
      setUpdating(false)
    })
  })

  const [updating, setUpdating] = React.useState(false)

  const getFontColor = (hasError: unknown): keyof DefaultTheme => (hasError ? 'errorRed' : 'darkFont')
  return (
    <form onSubmit={onSubmit}>
      <CreateBriefingLayout
        firstNameTraineeInput={
          <>
            <Text
              color={getFontColor(errors.firstNameTrainee)} {...inputLabelProps}>
              {strings.paper.createBriefing.firstnameTrainee}
            </Text>
            <Input
              {...register('firstNameTrainee', {
                required: strings.validation.required,
              })}
              disabled={updating}
              error={Boolean(errors.firstNameTrainee)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        lastNameTraineeInput={
          <>
            <Text
              color={getFontColor(errors.lastNameTrainee)} {...inputLabelProps}>
              {strings.paper.createBriefing.lastnameTrainee}
            </Text>
            <Input
              {...register('lastNameTrainee', {
                required: strings.validation.required,
              })}
              disabled={updating}
              error={Boolean(errors.lastNameTrainee)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        emailTraineeInput={
          <>
            <Text
              color={getFontColor(errors.emailTrainee)} {...inputLabelProps}>
              {strings.paper.createBriefing.emailTrainee}
            </Text>
            <Input
              type="email"
              {...register('emailTrainee', {
                required: true,
                validate: validateEmail,
              })}
              disabled={updating}
              error={Boolean(errors.emailTrainee)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
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
        /** companyInput={
           <>
             <Text color={getFontColor(errors.companyId)} {...inputLabelProps}>
               {strings.company}
             </Text>
             <StyledSelect
               {...register('companyId', { required: strings.validation.required })}
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
         }*/
        startDateProjectInput={
          <>
            <Text
              color={getFontColor(errors.startDateProjectInput || errors.startDateProjectInput)} {...inputLabelProps}>
              {strings.paper.createBriefing.projectPeriod}
            </Text>
            <Input
              type="date"
              block
              disabled={updating}
              error={Boolean(errors.startDateProjectInput)}
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
              block
              disabled={updating}
              error={Boolean(errors.endDateProjectInput)}
              onBlur={blurSubmit ? onSubmit : undefined}
            />
          </>
        }
        startDateSchoolInput={
          <>
            <Text
              color={getFontColor(errors.startDateSchool || errors.endDateSchool)} {...inputLabelProps}>
              {strings.paper.createBriefing.schoolPeriod}
            </Text>
            <Input
              type="date"
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
