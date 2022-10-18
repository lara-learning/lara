import { createGlobalStyle } from 'styled-components'
import modernNormalize from 'styled-modern-normalize'

export const GlobalBackground = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
  }
`

export const ModernNormalize = createGlobalStyle`
  ${modernNormalize}
`
