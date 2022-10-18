import React from 'react'
import { useForm } from 'react-hook-form'

import { H1, Paragraph, Spacer, DepartmentInput, ErrorText } from '@lara/components'
import { Flex } from '@rebass/grid'

import { Report, ReportStatus, Trainee } from '../graphql'
import DateHelper from '../helper/date-helper'
import strings from '../locales/localization'
import NavigationButtonLink from './navigation-button-link'

interface ReportPageHeaderProps {
  report: Pick<Report, 'week' | 'department' | 'year' | 'status' | 'id' | 'nextReportLink' | 'previousReportLink'>
  currentUser: Pick<Trainee, 'endOfToolUsage' | 'startOfToolUsage'>
  updateReport: (report: Partial<Report>) => Promise<void>
}

const ReportPageHeader: React.FunctionComponent<ReportPageHeaderProps> = ({ report, updateReport }) => {
  const [departmentSaving, setDepartmentSaving] = React.useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ department: string }>({
    reValidateMode: 'onChange',
  })

  const handleDepartmentSubmit = handleSubmit((formData) => {
    const isBlank = !formData.department && !report.department
    if (isBlank || formData.department === report.department) {
      return
    }

    setDepartmentSaving(true)

    updateReport({ department: formData.department }).then(() => {
      setDepartmentSaving(false)
    })
  })

  const startDate = DateHelper.startOfWeek(report.year, report.week)
  const endDate = DateHelper.endOfWeek(report.year, report.week)
  const reportArchived = report.status === ReportStatus.Archived
  const reportReview = report.status === ReportStatus.Review

  return (
    <>
      <Spacer xy="l">
        <Flex justifyContent={'space-between'}>
          <div>
            <H1 noMargin>
              {strings.report.headingContainer.title} {report.week}
            </H1>
            <Paragraph noMargin>
              {DateHelper.format(startDate, 'dd.MM.')} - {DateHelper.format(endDate, 'dd.MM.yyyy')}
            </Paragraph>
          </div>
          <Flex flexDirection="column" width="25%">
            <form onBlur={handleDepartmentSubmit} onSubmit={handleDepartmentSubmit}>
              <DepartmentInput
                key={report.id}
                block
                error={Boolean(errors.department)}
                disabled={reportArchived || reportReview || departmentSaving}
                placeholder={strings.report.department.title}
                defaultValue={report.department}
                {...register('department', {
                  minLength: {
                    value: 2,
                    message: strings.formatString(strings.validation.minLength, 2) as string,
                  },
                  maxLength: {
                    value: 64,
                    message: strings.formatString(strings.validation.maxLength, 64) as string,
                  },
                })}
              />
              <Spacer top="xxs">
                <ErrorText>{errors.department && errors.department.message}</ErrorText>
              </Spacer>
            </form>
          </Flex>
        </Flex>
      </Spacer>
      <Spacer bottom="l" x="l">
        <Flex justifyContent="space-between" alignItems="center">
          <div>
            {report.previousReportLink && (
              <NavigationButtonLink
                isLeft
                to={report.previousReportLink}
                label={strings.report.headingContainer.back}
                icon={'ChevronLeft'}
                iconColor="iconLightGrey"
              />
            )}
          </div>
          <div>
            {report.nextReportLink && (
              <NavigationButtonLink
                to={report.nextReportLink}
                label={strings.report.headingContainer.forward}
                icon={'ChevronRight'}
                iconColor="iconLightGrey"
              />
            )}
          </div>
        </Flex>
      </Spacer>
    </>
  )
}

export default ReportPageHeader
