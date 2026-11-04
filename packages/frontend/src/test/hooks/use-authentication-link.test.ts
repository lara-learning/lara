import { ApolloLink, execute, gql, Observable } from '@apollo/client'

jest.mock('../../helper/auth-helper', () => ({
  getAccessToken: jest.fn(),
}))

jest.mock('../../hooks/use-authentication', () => ({
  useAuthentication: jest.fn(),
}))

import { createAuthenticationLink, isUnauthorizedNetworkError } from '../../hooks/use-authentication-link'

const query = gql`
  query CurrentUser {
    currentUser {
      id
    }
  }
`

const executeLink = (link: ApolloLink): Promise<unknown> =>
  new Promise((resolve, reject) => {
    execute(link, { query }).subscribe({
      next: reject,
      error: resolve,
      complete: () => reject(new Error('Observable completed without an error')),
    })
  })

const linkWithError = (error: unknown, options: Parameters<typeof createAuthenticationLink>[0]): ApolloLink =>
  ApolloLink.from([
    createAuthenticationLink(options),
    new ApolloLink(() => new Observable((observer) => observer.error(error))),
  ])

describe('isUnauthorizedNetworkError', () => {
  it('detects HttpLink 401 errors', () => {
    expect(isUnauthorizedNetworkError({ statusCode: 401 })).toBe(true)
    expect(isUnauthorizedNetworkError({ response: { status: 401 } })).toBe(true)
  })

  it('ignores non-401 failures', () => {
    expect(isUnauthorizedNetworkError({ statusCode: 403 })).toBe(false)
    expect(isUnauthorizedNetworkError({ statusCode: 500 })).toBe(false)
    expect(isUnauthorizedNetworkError({ response: { status: 500 } })).toBe(false)
    expect(isUnauthorizedNetworkError(new Error('Failed to fetch'))).toBe(false)
    expect(isUnauthorizedNetworkError({ result: { errors: [{ message: 'Not Authorised!' }] } })).toBe(false)
  })
})

describe('createAuthenticationLink 401 handling', () => {
  it('logs out and propagates HTTP 401 when an access token is stored', async () => {
    const logout = jest.fn()
    const login = jest.fn()
    const error = { statusCode: 401 }

    const received = await executeLink(
      linkWithError(error, {
        getAccessToken: () => 'lara-access-token',
        login,
        logout,
      })
    )

    expect(received).toBe(error)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(login).not.toHaveBeenCalled()
  })

  it('does not log out again on HTTP 401 when no access token is stored', async () => {
    const logout = jest.fn()
    const error = { statusCode: 401 }

    const received = await executeLink(
      linkWithError(error, {
        getAccessToken: () => undefined,
        login: jest.fn(),
        logout,
      })
    )

    expect(received).toBe(error)
    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('does not log out on HTTP 403, 500 or network failures when a token is stored', async () => {
    const errors = [{ statusCode: 403 }, { statusCode: 500 }, new Error('Failed to fetch')]

    for (const error of errors) {
      const logout = jest.fn()

      const received = await executeLink(
        linkWithError(error, {
          getAccessToken: () => 'lara-access-token',
          login: jest.fn(),
          logout,
        })
      )

      expect(received).toBe(error)
      expect(logout).not.toHaveBeenCalled()
    }
  })
})
