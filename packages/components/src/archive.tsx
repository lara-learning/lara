import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Container } from './container'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

export const StyledNoResults = styled.div`
  @media (min-width: 615px) {
    margin-left: 80px;
    margin-right: 80px;
  }
  @media (max-width: 615px) {
    margin-left: 15px;
    margin-right: 15px;
  }
`

export const StyledTableHeadText = styled.span`
  color: ${(props) => props.theme.darkFont};
  font-size: ${FontSizes.smallCopy};
  letter-spacing: 0.2px;
  font-weight: bold;
  text-decoration: none;
`

export const StyledArchiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const StyledArchiveTableRow = styled.tr`
  td {
    position: relative;
    border-top: ${(props) => props.theme.inputBorderEmpty} 1px solid;
    height: 64px;
  }

  #chevron {
    transition: all 0.3s;
  }

  :hover {
    cursor: pointer;

    i {
      #box {
        fill: ${(props) => props.theme.iconBlue};
      }

      #chevron {
        transform: translateX(5px);
        fill: ${(props) => props.theme.iconBlue};
      }
    }

    td {
      :first-child ::before {
        content: ' ';
        background-color: ${(props) => props.theme.iconBlue};
        height: 64px;
        width: 6px;
        position: absolute;
        transform: translateY(-50%);
        left: -${Spacings.l};
        top: 50%;
      }
    }
  }
`
export const StyledArchiveOverviewText = styled.span`
  color: ${(props) => props.theme.mediumFont};
  font-size: ${FontSizes.copy};
  font-weight: normal;
  text-decoration: none;
`

export const StyledArchiveContainer = styled(Container)`
  overflow: hidden;
  padding: ${Spacings.l} ${Spacings.l} 0;
`

export const StyledArchiveLink = styled(Link)`
  text-decoration: none;
`
