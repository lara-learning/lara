import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AuthenticatedContext, GqlResolvers } from '@lara/api'

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

export const avatarResolver: GqlResolvers<AuthenticatedContext> = {
  Mutation: {
    getAvatarSignedUrl: async (_parent, _args, context) => {
      const key = `${context.currentUser.id}`

      try {
        await s3Client.send(
          new HeadObjectCommand({
            Bucket: AVATAR_BUCKET,
            Key: key,
          })
        )
      } catch (_) {
        return undefined
      }

      const command = new GetObjectCommand({
        Bucket: AVATAR_BUCKET,
        Key: key,
      })

      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 })
      if (!url) throw new Error('Could not generate signed get URL')
      return url
    },
  },
}
