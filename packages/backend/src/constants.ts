const { FRONTEND_URL, BACKEND_URL, ALEXA_AMAZON_CLIENT_ID, ALEXA_AMAZON_CLIENT_SECRET, ALEXA_SKILL_ID, LARA_SECRET } =
  process.env

if (!FRONTEND_URL) {
  throw new Error("Missing Environment Variable: 'FRONTEND_URL'")
}

if (!BACKEND_URL) {
  throw new Error("Missing Environment Variable: ' BACKEND_URL'")
}

if (!LARA_SECRET) {
  throw new Error("Missing Environment Variable: 'LARA_SECRET'")
}

export const LaraSecret = LARA_SECRET
export const FrontendUrl = FRONTEND_URL
export const BackendUrl = BACKEND_URL

if (!ALEXA_AMAZON_CLIENT_ID) {
  throw new Error("Missing Environment Variable: 'ALEXA_AMAZON_CLIENT_ID'")
}

if (!ALEXA_AMAZON_CLIENT_SECRET) {
  throw new Error("Missing Environment Variable: 'ALEXA_AMAZON_CLIENT_SECRET'")
}

if (!ALEXA_SKILL_ID) {
  throw new Error("Missing Environment Variable: 'ALEXA_SKILL_ID'")
}

export const AlexaAmazonClientId = ALEXA_AMAZON_CLIENT_ID
export const AlexaAmazonClientSecret = ALEXA_AMAZON_CLIENT_SECRET
export const AlexaSkillId = ALEXA_SKILL_ID
