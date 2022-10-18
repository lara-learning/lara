import styled from 'styled-components'

import { Input } from './new-input'

export const StyledTopBorderWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.inputBorderEmpty};
`

export const DepartmentInput = styled(Input)`
  background: ${(props) => props.theme.background};
`
