import { SkillBuilders } from 'ask-sdk-core'
import { SkillRequestSignatureVerifier, TimestampVerifier } from 'ask-sdk-express-adapter'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { ErrorHandler } from './handlers/error'
import { LaunchRequestHandler } from './handlers/launch'
import { SessionEndedHandler } from './handlers/session-ended'
import { CancelAndStopIntentHandler } from './intents/cancel-stop'
import { CreateEntryIntent } from './intents/create-entry/main'
import { StartedCreateEntryIntent } from './intents/create-entry/started'
import { HelpIntentHandler } from './intents/help'
import { NoIntent } from './intents/no'
import { SubmitReportIntent } from './intents/submit-report/main'
import { StartedSubmitReportIntent } from './intents/submit-report/started'
import { UpdateDayIntent } from './intents/update-day/main'
import { StartedUpdateDayIntent } from './intents/update-day/started'
import { YesIntent } from './intents/yes'

const { ALEXA_SKILL_ID } = process.env
if (!ALEXA_SKILL_ID) {
  throw new Error("Missing Environment Variable: 'ALEXA_SKILL_ID'")
}

export const alexaSkill = SkillBuilders.custom()
  .withSkillId(ALEXA_SKILL_ID)
  .addRequestHandlers(
    // Intents have to be loaded before the handlers since
    // some handlers rely on the execution order

    StartedCreateEntryIntent,
    CreateEntryIntent,

    StartedUpdateDayIntent,
    UpdateDayIntent,

    StartedSubmitReportIntent,
    SubmitReportIntent,

    YesIntent,
    NoIntent,

    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedHandler
  )
  .addErrorHandlers(ErrorHandler)
  .create()

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Missing request body',
    }
  }

  // we make sure that the request is valid and send by alexa
  try {
    await new SkillRequestSignatureVerifier().verify(event.body, event.headers)
    await new TimestampVerifier().verify(event.body)
  } catch (err) {
    console.log('Request Error ', err)

    return {
      statusCode: 400,
      body: "Request couldn't be verified",
    }
  }

  const response = await alexaSkill.invoke(JSON.parse(event.body), context)

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}
