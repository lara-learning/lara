import { CloudWatchLogsHandler } from 'aws-lambda'
import { sign } from 'jsonwebtoken'

const { BACKEND_URL, LARA_SECRET } = process.env

if (!BACKEND_URL) {
  throw new Error('Missing Env Variable')
}

if (!LARA_SECRET) {
  throw new Error("Missing Environment Variable: 'LARA_SECRET'")
}

export const handler: CloudWatchLogsHandler = async () => {
  const token = sign({ scope: 'cleanup' }, LARA_SECRET, {
    algorithm: 'HS256',
    audience: 'lara-backend-cleanup',
    expiresIn: 60,
    issuer: 'lara-cleanup',
    subject: 'scheduled-cleanup',
  })

  const response = await fetch(`${BACKEND_URL}/backend/internal/cleanup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Cleanup request failed with status ${response.status}`)
  }

  return response.json()
}
