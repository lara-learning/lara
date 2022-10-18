import styled from 'styled-components'
import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Input } from './new-input'
import { Spacings } from './spacing'

export const TimeTableGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, auto);
  background-color: ${(props) => props.theme.surface};
  text-align: center;
  border-radius: ${BorderRadii.xxs};
`

export const TimeTableColumnWrapper = styled.div<{ column: number; rows: number }>`
  display: grid;
  grid-column: ${({ column }) => column};
  grid-template-rows: repeat(${({ rows }) => rows}, 30px);

  &:not(:first-child) {
    min-width: 100px;
  }

  &:nth-child(1) {
    color: ${(props) => props.theme.lightFont};
    font-size: 12px;
    &:hover {
      background-color: none !important;
    }
  }
`
export const TimeTableRow = styled.div<{
  rowStart: number
  rowEnd?: number
  timeRow: boolean
  entryRow?: boolean
  viewOnly?: boolean
}>`
  grid-row: ${({ rowStart }) => rowStart} ${({ rowEnd }) => rowEnd && '/' + rowEnd};
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.entryRow &&
    `
    color: ${props.theme.timetableFont};
    background-color: ${props.theme.buttonSecondaryGhostDefault};
    border: ${Spacings.xxs} solid transparent;
    border-radius: ${BorderRadii.xxs};
    font-size: ${FontSizes.label};
    overflow-wrap: anywhere;
    margin: ${Spacings.xxs};
    font-weight: bold;
  `}
  ${(props) =>
    !props.timeRow &&
    !props.entryRow &&
    `
      border-bottom: ${props.theme.separator} 1px solid;
    `}
    &:hover {
    ${(props) =>
      !props.timeRow &&
      !props.viewOnly &&
      `
      border-radius: ${BorderRadii.xxs};
      background-color: ${props.theme.secondaryHovered};

      `}
    ${(props) =>
      !props.timeRow &&
      !props.entryRow &&
      !props.viewOnly &&
      `
          &:not(:first-child) {
            border-left: 2px solid ${props.theme.primaryHovered};
          }
      `}
  }

  &:first-child {
    color: ${(props) => props.theme.darkFont};
    font-weight: 700;
    font-size: 16px;
    padding: 4px 8px;
  }
`

export const TimeTableConfigInput = styled(Input)`
  height: 44px;
  margin-top: ${Spacings.xxs};
`

export const To = styled.p`
  color: ${(props) => props.theme.mediumFont};
  font-size: ${FontSizes.copy};
  margin: auto auto;
  padding-left: ${Spacings.m};
`
