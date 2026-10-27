import { APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda'
import { sign } from 'jsonwebtoken'

import { handler } from '../handler'

const methodArn = 'arn:aws:execute-api:eu-central-1:123456789012:api/staging/POST/backend/graphql'

const eventWithToken = (authorizationToken: string): APIGatewayTokenAuthorizerEvent => ({
  type: 'TOKEN',
  authorizationToken,
  methodArn,
})

const context = {} as Context

describe('authorizer', () => {
  it.each(['', 'allow', 'test', 'Bearer ', 'Bearer test', 'Basic token'])(
    'rejects invalid authorization token %j',
    async (token) => {
      await expect(handler(eventWithToken(token), context, () => undefined)).rejects.toThrow('Unauthorized')
    }
  )

  it('rejects a token signed with the wrong secret', async () => {
    const token = sign({ sub: 'user-1' }, 'wrong-secret', { expiresIn: '1h' })

    await expect(handler(eventWithToken(`Bearer ${token}`), context, () => undefined)).rejects.toThrow('Unauthorized')
  })

  it('rejects expired tokens', async () => {
    const token = sign({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) - 60 }, 'test-secret')

    await expect(handler(eventWithToken(`Bearer ${token}`), context, () => undefined)).rejects.toThrow('Unauthorized')
  })

  it('rejects tokens without an expiration', async () => {
    const token = sign({ sub: 'user-1' }, 'test-secret')

    await expect(handler(eventWithToken(`Bearer ${token}`), context, () => undefined)).rejects.toThrow('Unauthorized')
  })

  it('rejects tokens without a subject', async () => {
    const token = sign({ exp: Math.floor(Date.now() / 1000) + 3600 }, 'test-secret')

    await expect(handler(eventWithToken(`Bearer ${token}`), context, () => undefined)).rejects.toThrow('Unauthorized')
  })

  it('rejects tokens signed with a different algorithm', async () => {
    const token = sign({ sub: 'user-1' }, 'test-secret', { expiresIn: '1h', algorithm: 'HS384' })

    await expect(handler(eventWithToken(`Bearer ${token}`), context, () => undefined)).rejects.toThrow('Unauthorized')
  })

  it('allows a valid signed token for its subject', async () => {
    const token = sign({ sub: 'user-1' }, 'test-secret', { expiresIn: '1h', algorithm: 'HS256' })
    const result = await handler(eventWithToken(`Bearer ${token}`), context, () => undefined)

    if (!result) {
      throw new Error('Expected an authorizer policy')
    }

    expect(result.principalId).toBe('user-1')
    expect(result.policyDocument.Statement).toEqual([
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: methodArn,
      },
    ])
  })
})
