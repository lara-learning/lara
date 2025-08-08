import { S3Client, PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3'

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
