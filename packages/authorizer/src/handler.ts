import { APIGatewayAuthorizerHandler, CustomAuthorizerResult, StatementEffect } from 'aws-lambda'
import { JwtPayload, verify } from 'jsonwebtoken'

const secret = process.env.LARA_SECRET

if (!secret) {
  throw new Error("Missing Environment Variable: 'LARA_SECRET'")
}

const generatePolicy = (
  principalId: string,
  effect: StatementEffect,
  resource: string
): CustomAuthorizerResult | undefined => {
  if (!effect || !resource) {
    return
  }

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  }
}

export const handler: APIGatewayAuthorizerHandler = async (event, _context) => {
  if (event.type === 'REQUEST') {
    throw new Error('Wrong authentication type')
  }

  const tokenMatch = /^Bearer\s+(\S+)$/i.exec(event.authorizationToken)
  if (!tokenMatch) {
    throw new Error('Unauthorized')
  }

  let payload: string | JwtPayload
  try {
    payload = verify(tokenMatch[1], secret, { algorithms: ['HS256'] })
  } catch {
    throw new Error('Unauthorized')
  }

  if (
    typeof payload !== 'object' ||
    typeof payload.sub !== 'string' ||
    !payload.sub.trim() ||
    typeof payload.exp !== 'number' ||
    payload.exp <= Math.floor(Date.now() / 1000)
  ) {
    throw new Error('Unauthorized')
  }

  const policy = generatePolicy(payload.sub, 'Allow', event.methodArn)
  if (!policy) throw new Error('No effect or resource was passed')

  return policy
}
