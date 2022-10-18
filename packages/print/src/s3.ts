import { S3, Endpoint, AWSError } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

import { PrintData } from '@lara/api'

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

export const getExport = (key: string): Promise<PrintData | undefined> => {
  return s3Client
    .getObject({
      Bucket: EXPORT_BUCKET,
      Key: key,
    })
    .promise()
    .then((res) => res.Body && JSON.parse(res.Body.toString('utf-8')))
    .catch((e) => {
      console.error('Error while trying to get Data from S3 Bucket: ', e)
    })
}

export const saveAttachments = (key: string, body: Buffer): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> => {
  return s3Client
    .putObject({
      Bucket: EXPORT_BUCKET,
      Key: key,
      Body: body,
    })
    .promise()
}
