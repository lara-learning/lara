import { S3Client, GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3'

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

export const getAttachments = async (key: string): Promise<GetObjectCommandOutput | undefined> => {
  try {
    const command = new GetObjectCommand({
      Bucket: EXPORT_BUCKET,
      Key: key,
    })
    return await s3Client.send(command)
  } catch (e) {
    console.error('Error while fetching attachment from S3: ', e)
    return undefined
  }
}
