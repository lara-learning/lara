import { APIGatewayAuthorizerHandler, CustomAuthorizerResult, StatementEffect } from 'aws-lambda'

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

  const policy = generatePolicy('user', 'Allow', event.methodArn)
  if (!policy) throw new Error('No effect or resource was passed')

  return policy
}
