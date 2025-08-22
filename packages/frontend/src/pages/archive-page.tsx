import React from 'react'

import {
  StyledNoResults,
  StyledArchiveTableRow,
  StyledTableHeadText,
  StyledArchiveTable,
  H1,
  H2,
  Paragraph,
  Spacer,
  StyledIcon,
  StyledSearch,
  StyledArchiveOverviewText,
  StyledArchiveContainer,
  StyledSearchWrapper,
  Spacings,
  StyledArchiveLink,
} from '@lara/components'
import { Flex } from '@rebass/grid'

import { PrimaryButton } from '../components/button'
import { CheckBox } from '../components/checkbox'
import Illustrations from '../components/illustration'
import Loader from '../components/loader'
import { DayStatusEnum, Report, ReportStatus, useArchivePageDataQuery } from '../graphql'
import DateHelper from '../helper/date-helper'
import { useFetchPdf } from '../hooks/use-fetch-pdf'
import { useIsDarkMode } from '../hooks/use-is-dark-mode'
import strings from '../locales/localization'
import { Template } from '../templates/template'

interface ArchiveFilter {
  department?: string
  year?: number
  week?: number
  yearEnd?: number
  weekEnd?: number
  searchText?: string
}

interface SelectedReports {
  [key: string]: boolean
}

interface ArchivePageState extends ArchiveFilter {
  checkedReports: SelectedReports
  export: boolean
}

const searchFilter =
  ({ department, year, week, yearEnd, weekEnd, searchText }: ArchiveFilter) =>
  (
    report?:
      | {
          __typename: 'Report'
          id: string
          week: number
          year: number
          status: ReportStatus
          department?: string | undefined
          days: {
            __typename?: 'Day' | undefined
            status?: DayStatusEnum | undefined
            entries: {
              __typename?: 'Entry' | undefined
              id: string
              time: number
              text: string
            }[]
          }[]
        }
      | undefined
  ): boolean => {
    if (!report) {
      return false
    }

    const yearMatch = !year || yearEnd || report.year === year
    const weekMatch = !week || weekEnd || report.week === week
    const yearSpanMatch = !yearEnd || (year && report.year >= year && report.year <= yearEnd)
    const weekSpanMatch = !weekEnd || (week && report.week >= week && report.week <= weekEnd)

    const departmentMatch =
      !department || (report.department && report.department.trim().toLowerCase().match(department))

    let textMatch = true
    if (searchText) {
      textMatch = report.days.some((day) =>
        day.entries.some((entry) => entry.text.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    return Boolean(yearMatch && weekMatch && departmentMatch && yearSpanMatch && weekSpanMatch && textMatch)
  }

const ArchivePage: React.FunctionComponent = () => {
  const [fetchPdf, pdfLoading] = useFetchPdf()
  const { loading, data } = useArchivePageDataQuery()
  const isDarkMode = useIsDarkMode(data?.currentUser)

  const [state, setState] = React.useState<ArchivePageState>({
    department: '',
    checkedReports: {},
    export: false,
  })

  const [allChecked, setAllChecked] = React.useState(false)

  const getArchivedReports = React.useCallback(() => {
    return data ? data.reports.filter((report) => report?.status === ReportStatus.Archived) : []
  }, [data])

  const archivedReports = getArchivedReports()

  const getFilteredReports = () => {
    return archivedReports.filter(searchFilter(state))
  }

  const getCheckState = (id: string): boolean => {
    const { checkedReports } = state
    if (checkedReports === null) {
      return false
    }
    return checkedReports[id]
  }

  const checkBoxUpdate = (id: string, isChecked: boolean) => {
    const { checkedReports } = state
    checkedReports[id] = isChecked
    setState({
      ...state,
      checkedReports,
    })
  }

  const checkAllBoxes = () => {
    const { checkedReports } = state
    filteredReports.forEach((report) => report && (checkedReports[report.id] = !allChecked))
    setState({
      ...state,
      checkedReports,
    })
  }

  const filteredReports = getFilteredReports()

  const getCheckedReports = React.useCallback((): Pick<Report, 'id'>[] => {
    const { checkedReports } = state
    if (checkedReports === null) {
      return []
    }
    return filteredReports.filter((report) => report && checkedReports[report.id]) as Pick<Report, 'id'>[]
  }, [filteredReports, state])

  React.useEffect(() => {
    if (data && getArchivedReports().length === getCheckedReports().length) {
      setAllChecked(true)
    } else {
      setAllChecked(false)
    }
  }, [data, getArchivedReports, getCheckedReports, state])

  const exportReports = (): void => {
    setState({
      ...state,
      checkedReports: {},
      export: true,
    })
    fetchPdf(getCheckedReports())
  }

  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value.toLowerCase()
    const yearMonthRegex = /([0-9]{4}):([0-9]{2})/
    const departmentRegex = /(department:|dep:)([a-z A-Z]+)/
    const timespanRegex = /(([0-9]{4}):([0-9]{2})) ?- ?(([0-9]{4}):([0-9]{2}))/
    let year: number | undefined = undefined
    let week: number | undefined = undefined
    let department: string | undefined = undefined
    let yearEnd: number | undefined = undefined
    let weekEnd: number | undefined = undefined
    let searchText: string | undefined = undefined

    const yearMatch = yearMonthRegex.exec(value)
    if (yearMonthRegex.test(value) && yearMatch) {
      year = parseInt(yearMatch[1], 10)
      week = parseInt(yearMatch[2], 10)
    }

    const timeSpanMatch = timespanRegex.exec(value)
    if (timespanRegex.test(value) && timeSpanMatch) {
      year = parseInt(timeSpanMatch[2], 10)
      yearEnd = parseInt(timeSpanMatch[5], 10)
      week = parseInt(timeSpanMatch[3], 10)
      weekEnd = parseInt(timeSpanMatch[6], 10)
    }

    const departmentMatch = departmentRegex.exec(value)
    if (departmentMatch) {
      department = departmentMatch[2].replace(/\s/g, '').trim()
    }

    if (!departmentMatch && !timeSpanMatch && !yearMatch) {
      searchText = value
    }

    setState({
      ...state,
      department,
      year,
      week,
      yearEnd,
      weekEnd,
      searchText,
    })
  }

  return (
    <Template type="Main">
      {loading && <Loader />}

      {!loading && archivedReports.length === 0 && (
        <Flex alignItems={'center'} flexDirection={'column'} mt={'3'} style={{ overflow: 'hidden' }}>
          <H1 center>{strings.archivePage.emptyState.initial.title}</H1>
          <Paragraph center>{strings.archivePage.emptyState.initial.caption} </Paragraph>
          <Illustrations.EmptyStateWaiting darkMode={isDarkMode} />
        </Flex>
      )}

      {!loading && archivedReports.length > 0 && (
        <>
          <StyledArchiveContainer>
            <StyledArchiveTable>
              <thead>
                <tr>
                  <th colSpan={3}>
                    <Spacer bottom={'l'}>
                      <H1 noMargin>{strings.archivePage.header}</H1>
                    </Spacer>
                  </th>
                  <th colSpan={2}>
                    <Spacer bottom={'l'}>
                      <StyledSearchWrapper>
                        <StyledIcon name={'Search'} size={Spacings.xl} color={'iconBlue'}></StyledIcon>
                        <StyledSearch placeholder={strings.archivePage.searchPlaceholder} onInput={onInput} required />
                      </StyledSearchWrapper>
                    </Spacer>
                  </th>
                </tr>
                {filteredReports.length !== 0 && (
                  <tr>
                    <td>
                      <CheckBox iconName={'SelectAll'} checked={allChecked} onClick={checkAllBoxes} />
                    </td>
                    <td>
                      <StyledTableHeadText>{strings.archivePage.tableHead.calendarWeek}</StyledTableHeadText>
                    </td>
                    <td>
                      <StyledTableHeadText>{strings.archivePage.tableHead.date}</StyledTableHeadText>
                    </td>
                    <td>
                      <StyledTableHeadText>{strings.archivePage.tableHead.department}</StyledTableHeadText>
                    </td>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  if (!report) {
                    return
                  }

                  const { week, year, department } = report
                  const startDate = DateHelper.startOfWeek(year, week)
                  const endDate = DateHelper.endOfWeek(year, week)

                  const link = `/report/${year}/${week}`

                  return (
                    <StyledArchiveTableRow key={report.id}>
                      <td>
                        <CheckBox
                          iconName={'Checkbox'}
                          checked={getCheckState(report.id)}
                          onClick={() => checkBoxUpdate(report.id, !getCheckState(report.id))}
                        />
                      </td>
                      <td>
                        <StyledArchiveLink to={link}>
                          <StyledArchiveOverviewText>{week}</StyledArchiveOverviewText>
                        </StyledArchiveLink>
                      </td>
                      <td>
                        <StyledArchiveLink to={link}>
                          <StyledArchiveOverviewText>
                            {DateHelper.format(startDate, 'dd.MM.')} - {DateHelper.format(endDate, 'dd.MM.yyyy')}
                          </StyledArchiveOverviewText>
                        </StyledArchiveLink>
                      </td>
                      <td>
                        <StyledArchiveLink to={link}>
                          <StyledArchiveOverviewText>{department}</StyledArchiveOverviewText>
                        </StyledArchiveLink>
                      </td>
                      <td>
                        <StyledArchiveLink to={link}>
                          <Flex justifyContent={'flex-end'}>
                            <StyledIcon color="iconDarkGrey" name={'ChevronRight'} size={'35px'} />
                          </Flex>
                        </StyledArchiveLink>
                      </td>
                    </StyledArchiveTableRow>
                  )
                })}
              </tbody>
            </StyledArchiveTable>

            {filteredReports.length === 0 && (
              <>
                <Spacer bottom={'xl'} top={'m'}>
                  <Flex alignItems={'center'} flexDirection={'column'} mt={'3'} style={{ overflow: 'hidden' }}>
                    <StyledNoResults>
                      <H2 center>{strings.archivePage.emptyState.noResult.title}</H2>
                      <Paragraph center>
                        {strings.formatString(
                          strings.archivePage.emptyState.noResult.caption,
                          <b>
                            <br />
                            Tip:
                          </b>,
                          <code>yyyy:ww</code>,
                          <code>yyyy:ww-yyyy:ww</code>
                        )}
                      </Paragraph>
                    </StyledNoResults>
                    <Illustrations.EmptyStateNoResult darkMode={isDarkMode} />
                  </Flex>
                </Spacer>
              </>
            )}
          </StyledArchiveContainer>

          <Flex py={'4'} flexDirection={'row-reverse'}>
            {filteredReports.length > 0 && (
              <PrimaryButton
                icon={pdfLoading ? 'Loader' : 'Download'}
                disabled={getCheckedReports().length === 0 || pdfLoading}
                onClick={exportReports}
              >
                {strings.report.export}
              </PrimaryButton>
            )}
          </Flex>
        </>
      )}
    </Template>
  )
}

export default ArchivePage
