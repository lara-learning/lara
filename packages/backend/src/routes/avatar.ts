import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Request, Response } from 'express'

const { IS_OFFLINE, AVATAR_BUCKET } = process.env

const s3Client = new S3Client(
  IS_OFFLINE
    ? {
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER',
        },
        endpoint: 'http://localhost:8181',
      }
    : { region: 'eu-central-1' }
)

export const handleAvatarUpload = async (req: Request, res: Response) => {
  const key = req.headers['x-user-id'] as string

  let base64String: string
  try {
    const parsed = JSON.parse(req.body.toString())
    base64String = parsed.data
  } catch {
    base64String = req.body.data
  }

  if (!base64String) return res.status(400).send('No file provided' + req.body.toString())

  const buffer = Buffer.from(base64String, 'base64')

  s3Client.send(
    new PutObjectCommand({
      Bucket: AVATAR_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: req.headers['content-type'],
      ContentLength: buffer.length,
    })
  )

  return res.status(200).send()
}

export const handleAvatarDeletion = async (req: Request, res: Response) => {
  const key = req.headers['x-user-id'] as string

  s3Client.send(
    new DeleteObjectCommand({
      Bucket: AVATAR_BUCKET,
      Key: key,
    })
  )

  return res.status(200).send()
}
