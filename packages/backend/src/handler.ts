import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
import cors, { CorsOptions } from 'cors'
import express from 'express'
import { applyMiddleware } from 'graphql-middleware'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, gqlSchema, LambdaContext, User } from '@lara/api'

import { FrontendUrl } from './constants'
import { isDebug, permissions } from './permissions'
import { userById } from './repositories/user.repo'
import { resolvers } from './resolvers'
import { handleAuthorizeRequest } from './routes/authorize'
import { handleCleanupRequest } from './routes/cleanup'
import { handleMicrosoftLoginRequest } from './routes/microsoft-login'
import { validateJWT } from './services/oauth.service'
import { parseBearerAuth } from './utils/security'
import { handleAvatarDeletion, handleAvatarUpload } from './routes/avatar'

const { STAGE, AUTH_HEADER } = process.env
const enableDevelopmentTools = STAGE === 'dev' && isDebug()

if (!AUTH_HEADER) {
  throw new Error("Missing Environment Variable: 'AUTH_HEADER'")
}

export const authHeader = AUTH_HEADER

/**
 * Fetches a user by the auth header in bearer format
 * @param auth Header string
 * @returns User or nothing
 */
const userByBearer = async (auth: string): Promise<User | undefined> => {
  const token = parseBearerAuth(auth)
  const payload = validateJWT(token)

  if (!payload) {
    return
  }

  return userById(payload.sub)
}

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: gqlSchema,
    resolvers,
  }),
  permissions
)

const apolloServer = new ApolloServer({
  schema,
  introspection: enableDevelopmentTools,
  formatError: (err) => ({
    message:
      err.extensions?.code === 'INTERNAL_SERVER_ERROR' || err.extensions?.exception
        ? 'Internal server error'
        : err.message,
  }),
  plugins: enableDevelopmentTools
    ? [
        ApolloServerPluginLandingPageGraphQLPlayground({
          endpoint: `/${STAGE}/graphql`,
        }),
      ]
    : [],
  context: async ({ event, express }: LambdaContext): Promise<Context> => {
    let user: User | undefined

    const header = event.headers.Authorization || event.headers.authorization

    if (header) {
      user = await userByBearer(header)
    }

    express.res.setHeader(authHeader, String(Boolean(user)))

    return {
      express,
      event,
      currentUser: user,
    }
  },
})

const corsOptions: CorsOptions = {
  credentials: true,
  exposedHeaders: ['Authorization', authHeader],
  origin: FrontendUrl,
  methods: '*',
  allowedHeaders: '*',
}

export const server: APIGatewayProxyHandler = apolloServer.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express()

    app.use(cors(corsOptions))

    app.post('/oauth/login', express.json(), handleMicrosoftLoginRequest)
    app.post('/oauth/token', express.json(), handleAuthorizeRequest)
    app.post('/internal/cleanup', handleCleanupRequest)
    app.post('/avatar', handleAvatarUpload)
    app.delete('/avatar', handleAvatarDeletion)

    app.use(middleware)

    return app
  },
  expressGetMiddlewareOptions: {
    cors: corsOptions,
  },
})
