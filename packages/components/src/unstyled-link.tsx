import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styled from 'styled-components'

interface UnstyledLinkProps extends LinkProps {
  fullWidth?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UnstyledLink = styled(({ fullWidth, ...rest }: UnstyledLinkProps) => <Link {...rest} />)`
  text-decoration: none;
  width: ${(props) => !props.fullWidth && 'fit-content'};
`
