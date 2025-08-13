import { Box as BaseBox } from '@rebass/grid'
import { styled } from 'styled-components'

const ignoredProps = new Set(['mt', 'mb', 'ml', 'mr', 'mx', 'my', 'pt', 'pr', 'pl', 'pb', 'px', 'py'])

export const Box = styled(BaseBox).withConfig({
  shouldForwardProp: (prop) => !ignoredProps.has(prop),
})``
