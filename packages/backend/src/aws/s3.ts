import { S3, Endpoint, AWSError } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

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

export const saveExport = (key: string, body: string): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> => {
  return s3Client
    .putObject({
      Bucket: EXPORT_BUCKET,
      Key: key,
      Body: body,
    })
    .promise()
}
