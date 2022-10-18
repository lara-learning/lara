import { S3, Endpoint } from 'aws-sdk'

const { IS_OFFLINE, EXPORT_BUCKET } = process.env

if (!EXPORT_BUCKET) {
  throw new Error("Missing env Var: 'EXPORT_BUCKET'")
}

const s3Client = new S3(
  IS_OFFLINE
    ? {
        s3ForcePathStyle: true,
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER',
        endpoint: new Endpoint('http://localhost:8181'),
      }
    : { region: 'eu-central-1' }
)

export const getAttachements = async (key: string): Promise<Buffer | undefined> => {
  const s3Object = await s3Client
    .getObject({
      Bucket: EXPORT_BUCKET,
      Key: key,
    })
    .promise()

  return s3Object.Body as Buffer
}
