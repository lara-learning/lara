import React from 'react'
import styled from 'styled-components'
import { Spacings } from './spacing'

const StyledList = styled.div`
  padding: ${Spacings.xl} 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 2rem;
`

type StyledAnchorProps = {
  active: boolean
}
const StyledAnchor = styled.div<StyledAnchorProps>`
  display: inline-block;
  width: ${Spacings.xs};
  height: ${Spacings.xs};
  background-color: ${(props) => (props.active ? props.theme.iconBlue : props.theme.iconLightGrey)};
  border: 0.25rem solid transparent;
  border-radius: 50%;
  font-size: 0;
  transition: transform 0.1s;
  align-items: center;
  cursor: pointer;
`

type StyledIndicatorType = {
  list: unknown[]
  setIndex: (index: number) => void
  activeIndex: number
}
export const StyledIndicator: React.FC<StyledIndicatorType> = ({ list, setIndex, activeIndex }) => {
  return (
    <StyledList>
      {list.map((_, index) => {
        return <StyledAnchor key={index} onClick={() => setIndex(index)} active={activeIndex === index} />
      })}
    </StyledList>
  )
}
