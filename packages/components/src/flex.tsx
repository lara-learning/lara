import { Flex as BaseFlex } from '@rebass/grid'
import { styled } from 'styled-components'

const ignoredProps = new Set([
  'alignItems',
  'flexDirection',
  'justifyContent',
  'flexWrap',
  'mt',
  'mb',
  'ml',
  'mr',
  'mx',
  'my',
  'pt',
  'pr',
  'pl',
  'pb',
  'px',
  'py',
])

export const Flex = styled(BaseFlex).withConfig({
  shouldForwardProp: (prop) => !ignoredProps.has(prop),
})``
