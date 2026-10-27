import { RequestHandler } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

import { cleanupUsers } from '../resolvers/admin.resolver'

const secret = process.env.LARA_SECRET

if (!secret) {
  throw new Error("Missing Environment Variable: 'LARA_SECRET'")
}

type CleanupResponse = { cleanup: boolean } | string

export const handleCleanupRequest: RequestHandler<unknown, CleanupResponse> = async ({ headers }, res) => {
  const tokenMatch = /^Bearer\s+(\S+)$/i.exec(headers.authorization ?? '')
  if (!tokenMatch) {
    return res.status(401).send('Unauthorized')
  }

  let payload: string | JwtPayload
  try {
    payload = verify(tokenMatch[1], secret, {
      algorithms: ['HS256'],
      audience: 'lara-backend-cleanup',
      issuer: 'lara-cleanup',
    })
  } catch {
    return res.status(401).send('Unauthorized')
  }

  if (typeof payload !== 'object' || payload.sub !== 'scheduled-cleanup' || payload.scope !== 'cleanup') {
    return res.status(401).send('Unauthorized')
  }

  return res.status(200).send({ cleanup: await cleanupUsers() })
}
