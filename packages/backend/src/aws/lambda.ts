import { EmailPayload, PrintPayload } from '@lara/api'
import { Lambda } from '@aws-sdk/client-lambda'

const { IS_OFFLINE, PRINT_FUNCTION, EMAIL_FUNCTION } = process.env

if (!EMAIL_FUNCTION) {
  throw new Error("Missing env Var: 'EMAIL_FUNCTION'")
}

if (!PRINT_FUNCTION) {
  throw new Error("Missing env Var: 'PRINT_FUNCTION'")
}

const lambda = new Lambda({
  region: 'eu-central-1',
  endpoint: IS_OFFLINE ? 'http://localhost:3002' : undefined,
})

type FunctionName = 'email' | 'print'

const functionNameMapping: Record<FunctionName, string> = {
  email: EMAIL_FUNCTION,
  print: PRINT_FUNCTION,
}

type LambdaOptions = { functionName: 'email'; payload: EmailPayload } | { functionName: 'print'; payload: PrintPayload }

/**
 * Invokes a lambda and doesn't wait for a response.
 * @param payload Lambda payload
 * @param functionName Defines between print and email Lambda
 */
export const invokeLambda = async ({ functionName, payload }: LambdaOptions): Promise<void> => {
  await lambda.invoke({
    FunctionName: functionNameMapping[functionName],
    InvocationType: 'Event',
    Payload: JSON.stringify(payload),
  })
}
