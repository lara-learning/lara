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

export const handler: APIGatewayAuthorizerHandler = (event, _context, callback) => {
  if (event.type === 'REQUEST') {
    return callback('Wrong authentication type')
  }

  return callback(null, generatePolicy('user', 'Allow', event.methodArn))
}
