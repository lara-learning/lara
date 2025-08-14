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
  Flex,
} from '@lara/components'

import { PrimaryButton } from '../components/button'
import { CheckBox } from '../components/checkbox'
import Illustrations from '../components/illustration'
import Loader from '../components/loader'
import { Report, ReportStatus, useArchivePageDataQuery } from '../graphql'
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
}

interface SelectedReports {
  [key: string]: boolean
}

interface ArchivePageState extends ArchiveFilter {
  checkedReports: SelectedReports
  export: boolean
  value: string
}

interface SearchOptions {
  search: string
  time?: string
  timespan?: string
}
const keys: (keyof SearchOptions)[] = ['time', 'timespan']

const normalize = (str: string) => {
  return str.toLowerCase().trim()
}

const parseTime = (str: string): { year: number; week: number } => {
  const dateRegexW = /^[0-9]{1,2}$/
  const dateRegexY = /^[0-9]{4}$/
  const dateRegexYW = /^[0-9]{4}:[0-9]{1,2}$/
  const dateRegexWY = /^[0-9]{1,2}:[0-9]{4}$/
  let year: number | string | undefined
  let week: number | string | undefined

  if (dateRegexY.test(str)) {
    year = str
  } else if (dateRegexW.test(str)) {
    week = str
  } else if (dateRegexYW.test(str)) {
    ;[year, week] = str.split(':')
  } else if (dateRegexWY.test(str)) {
    ;[week, year] = str.split(':')
  } else return { year: -1, week: -1 }

  year = parseInt((year ?? '-1').toString())
  week = parseInt((week ?? '-1').toString())
  return { year, week }
}

const extractOptions = (str: string): SearchOptions => {
  const options: SearchOptions = { search: str }
  for (const opt of keys) {
    const i = options.search.indexOf(opt + ':')
    if (i == 0 || (i >= 0 && options.search[i - 1] == ' ')) {
      const startIndex = i + opt.length + 2 + (i == 0 ? -1 : 0)
      let endIndex = startIndex
      while (endIndex < options.search.length && options.search[endIndex] !== ' ') endIndex++
      options[opt] = options.search.slice(startIndex, endIndex)
      options.search = options.search.slice(0, i) + options.search.slice(endIndex)
    }
  }
  return options
}

const filterReports = (reports: Report[], search: string): Report[] => {
  search = normalize(search)
  const options = extractOptions(search)
  search = options.search
  const filterdByOptions = reports.filter((report) => {
    if (options.time) {
      const { year, week } = parseTime(options.time)
      if (year < 0 && week < 0) return false
      if (year >= 0 && report.year !== year) return false
      if (week >= 0 && report.week !== week) return false
      return true
    }
    if (options.timespan) {
      const timespanRegex = /^[0-9:]{1,7}-[0-9:]{1,7}$/
      let time1: string
      let time2: string

      if (timespanRegex.test(options.timespan)) {
        ;[time1, time2] = options.timespan.split('-')
      } else return false

      let { year: yearFrom, week: weekFrom } = parseTime(time1)
      let { year: yearTo, week: weekTo } = parseTime(time2)

      console.log(yearFrom + ', ' + weekFrom)
      console.log(yearTo + ', ' + weekTo)

      // switch order if needed
      if (yearTo < yearFrom) {
        const [tempY, tempW] = [yearFrom, weekFrom]
        yearFrom = yearTo
        weekFrom = weekTo
        yearTo = tempY
        weekTo = tempW
      } else if (yearFrom < 0 && yearTo < 0 && weekTo < weekFrom) {
        const tempW = weekFrom
        weekFrom = weekTo
        weekTo = tempW
      }

      if (yearFrom >= 0 && yearTo >= 0) {
        //both years were entered by user
        if (report.year > yearFrom && report.year < yearTo) return true //between the years
        if (report.year < yearFrom || report.year > yearTo) return false //outside the years
        if (report.year == yearFrom) {
          return weekFrom < 0 || report.week >= weekFrom //matching lower year, and no week or greater than week
        }
        if (report.year == yearTo) {
          return weekTo < 0 || report.week <= weekTo //matching upper year, and no week or lower than week
        }
      }
      //no years entered
      if (yearFrom < 0 && yearTo < 0 && weekFrom >= 0 && weekTo >= 0) {
        return report.week >= weekFrom && report.week <= weekTo
      }
      //misformed timespan entered
      return false
    }
    return true
  })

  return filterdByOptions.filter((report) => {
    const department = report.department ?? ''
    const entries: string[] = report.days.map((day) => day.entries.map((entry) => normalize(entry.text))).flat()

    if (department.includes(search)) return true

    for (const entry of entries) {
      if (entry.includes(search)) return true
    }

    return false
  })
}

const ArchivePage: React.FunctionComponent = () => {
  const [fetchPdf, pdfLoading] = useFetchPdf()

  const { loading, data } = useArchivePageDataQuery()

  const isDarkMode = useIsDarkMode(data?.currentUser)

  const [state, setState] = React.useState<ArchivePageState>({
    department: '',
    checkedReports: {},
    export: false,
    value: '',
  })

  const [allChecked, setAllChecked] = React.useState(false)

  const getArchivedReports = React.useCallback(() => {
    return data ? data.reports.filter((report) => report?.status === ReportStatus.Archived) : []
  }, [data])

  const archivedReports = getArchivedReports()

  const getFilteredReports = () => {
    if (state.value === '') return archivedReports as Report[]
    return filterReports(archivedReports as Report[], state.value)
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
    setState({
      ...state,
      value,
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
