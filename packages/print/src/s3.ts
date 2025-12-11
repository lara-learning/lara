import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandOutput,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'

import { PrintData } from '@lara/api'

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

const streamToString = async (stream: Readable): Promise<string> => {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf-8')
}

export const getExport = async (key: string): Promise<PrintData | undefined> => {
  try {
    const command = new GetObjectCommand({
      Bucket: EXPORT_BUCKET,
      Key: key,
    })
    const res: GetObjectCommandOutput = await s3Client.send(command)

    if (res.Body && res.Body instanceof Readable) {
      const bodyStr = await streamToString(res.Body)
      return JSON.parse(bodyStr)
    } else return undefined
  } catch (e) {
    console.error('Error while trying to get Data from S3 Bucket: ', e)
    return undefined
  }
}

export const saveAttachments = async (key: string, body: Buffer): Promise<PutObjectCommandOutput | undefined> => {
  try {
    const command = new PutObjectCommand({
      Bucket: EXPORT_BUCKET,
      Key: key,
      Body: body,
    })
    return await s3Client.send(command)
  } catch (e) {
    console.error('Error while saving attachment to S3: ', e)
    return undefined
  }
}

export const fileExists = async (key: string): Promise<boolean> => {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: EXPORT_BUCKET, Key: key }))
    return true
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      ((err as { name?: string }).name === 'NotFound' ||
        (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404)
    ) {
      return false
    }
    console.error('Error while checking file existence in S3:', err)
    throw err instanceof Error ? err : new Error('Unknown error')
  }
}
