import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 18.5px;
  line-height: 17px;
  color: black;
  font-weight: 500;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  font-family: sans-serif;
  user-select: none;
  margin: 8px 0;
`

const InnerWrapper = styled.div`
  width: 100px;
  height: 100%;
`

const Label = styled.label`
  color: white;
  font-weight: 700;
  margin-right: 4px;
`

const Selected = styled.div.withConfig({
  shouldForwardProp: (prop) => !['open'].includes(prop),
})<{ open: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #999;
  border-radius: 3px;
  background: #f3f3f3;
  cursor: pointer;

  &::after {
    content: '▼';
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%) rotate(${({ open }) => (open ? '180deg' : '0deg')});
    font-size: 10px;
    color: #999;
    pointer-events: none;
    -webkit-transition: 100ms linear transform;
    -moz-transition: 100ms linear transform;
    -o-transition: 100ms linear transform;
    transition: 100ms linear transform;
  }
`

const Menu = styled.ul.withConfig({
  shouldForwardProp: (prop) => !['yOffset'].includes(prop),
})<{ yOffset: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
  transform: ${({ yOffset }) => 'translateY(-' + yOffset + '%)'};
`

const Option = styled.li.withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop),
})<{ selected: boolean }>`
  width: 100px;
  height: 100%;
  background: ${({ selected }) => (selected ? '#ddd' : '#fff')};
  outline-offset: -1px;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`

export function CustomDropdown({
  value,
  onChange,
  onOpenChange,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement> | string) => void
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const options = ['Trainee', 'Trainer', 'Mentor', 'Admin']

  const setOpenState = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      if (onOpenChange) {
        onOpenChange(newOpen)
      }
    },
    [onOpenChange]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setOpenState])

  const getYOffset = () => {
    return options.length * 50 + 50
  }

  return (
    <DropdownWrapper ref={dropdownRef}>
      <Label>Usertype: </Label>
      <InnerWrapper>
        <Selected onClick={() => setOpenState(!open)} open={open}>
          {value || 'Select user type'}
        </Selected>
        {open && (
          <Menu yOffset={getYOffset()}>
            {options.map((option) => (
              <Option
                key={option}
                selected={option === value}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                {option}
              </Option>
            ))}
          </Menu>
        )}
      </InnerWrapper>
    </DropdownWrapper>
  )
}
