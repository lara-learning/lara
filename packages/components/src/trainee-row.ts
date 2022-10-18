import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'
import { StyledIcon } from './icons'
import { BorderRadii } from './border-radius'

interface ActivateableProps {
  active?: boolean
}

export const StyledHeader = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-grow: 1;
`

export const StyledName = styled.span`
  font-size: ${FontSizes.copy};
  font-weight: bold;
  letter-spacing: 0.3px;
  color: ${(props) => props.theme.darkFont};
  margin-right: ${Spacings.m};
  margin-left: ${Spacings.m};
`

export const StyledIndicatorIcon = styled(StyledIcon)<ActivateableProps>`
  margin-right: ${Spacings.m};
  transform: rotate(${(props) => (props.active ? '180deg' : '0deg')});
  transition: all 0.2s;
`

export const StyledWrapper = styled.div`
  margin-bottom: ${Spacings.l};
  background-color: ${(props) => props.theme.surface};
  border-bottom: solid 1px ${(props) => props.theme.inputBorderEmpty};
  border-radius: ${BorderRadii.xxs};
  > div > a {
    padding: ${Spacings.m};
  }

  :hover ${StyledIndicatorIcon} svg {
    fill: ${(props) => props.theme.iconBlue};
  }
`

export const StyledControls = styled.div<ActivateableProps>`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.surface};
  border-radius: ${BorderRadii.xxs};
`

export const StyledCourse = styled.span`
  font-size: ${FontSizes.smallCopy};
  color: ${(props) => props.theme.mediumFont};

  @media screen and (max-width: 500px) {
    display: none;
  }
`

export const StyledClaimIcon = styled(StyledIcon)`
  cursor: pointer;

  & svg {
    fill: ${(props) => props.theme.iconBlue};
  }
`

export const StyledUnclaimIcon = styled(StyledClaimIcon)`
  &:hover {
    svg {
      fill: ${(props) => props.theme.errorRed};
    }
  }
`

export const StyledBody = styled.div`
  padding-left: 56px;
`

export const StyledInfoValue = styled.span`
  color: ${(props) => props.theme.mediumFont};
  margin-bottom: ${Spacings.m};
  font-size: ${FontSizes.copy};
  :last-child {
    margin-bottom: ${Spacings.m};
  }
`

export const StyledInfoLabel = styled.span`
  color: ${(props) => props.theme.darkFont};
  margin-bottom: ${Spacings.s};
  font-size: ${FontSizes.smallCopy};
  letter-spacing: 0.2px;
  font-weight: bold;
  text-transform: uppercase;
`
