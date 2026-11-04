import { createRemoteJWKSet, errors, jwtVerify } from 'jose'

const { MICROSOFT_CLIENT_ID, MICROSOFT_TENANT_ID } = process.env

if (!MICROSOFT_CLIENT_ID) {
  throw new Error("Missing Environment Variable: 'MICROSOFT_CLIENT_ID'")
}

if (!MICROSOFT_TENANT_ID) {
  throw new Error("Missing Environment Variable: 'MICROSOFT_TENANT_ID'")
}

const issuer = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/v2.0`
const microsoftJwks = createRemoteJWKSet(
  new URL(`https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/discovery/v2.0/keys`)
)

export const emailFromMicrosoftIdToken = async (idToken: string): Promise<string | undefined> => {
  try {
    const { payload } = await jwtVerify(idToken, microsoftJwks, {
      algorithms: ['RS256'],
      audience: MICROSOFT_CLIENT_ID,
      issuer,
    })

    if (typeof payload.sub !== 'string' || !payload.sub.trim()) {
      return undefined
    }

    const email = payload.email ?? payload.preferred_username
    return typeof email === 'string' && email.trim() ? email.trim() : undefined
  } catch (error) {
    if (
      error instanceof errors.JWTExpired ||
      error instanceof errors.JWTClaimValidationFailed ||
      error instanceof errors.JWTInvalid ||
      error instanceof errors.JWSInvalid ||
      error instanceof errors.JWKSNoMatchingKey ||
      error instanceof errors.JWSSignatureVerificationFailed ||
      error instanceof errors.JOSEAlgNotAllowed
    ) {
      return undefined
    }

    throw error
  }
}
