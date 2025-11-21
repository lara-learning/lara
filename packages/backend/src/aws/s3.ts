import { S3Client, PutObjectCommand, PutObjectCommandOutput, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { IS_OFFLINE, EXPORT_BUCKET } = process.env

if (!EXPORT_BUCKET) {
  throw new Error("Missing env Var: 'EXPORT_BUCKET'")
}

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

export const saveExport = async (key: string, body: string): Promise<PutObjectCommandOutput> => {
  const command = new PutObjectCommand({
    Bucket: EXPORT_BUCKET,
    Key: key,
    Body: body,
  })

  return await s3Client.send(command)
}

export const getExport = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: EXPORT_BUCKET,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 10 })
  if (!url) throw new Error('Could not generate signed URL')

  return url
}
