import { APIGatewayProxyEvent, Context as AWSContext } from 'aws-lambda'
import { Request, Response } from 'express'

import { Trainee, Trainer, Admin, User } from './models'

type ExpressContext = {
  req: Request
  res: Response
}

export type BaseContext = {
  event: APIGatewayProxyEvent
  express: ExpressContext
}

export type Context = BaseContext & {
  currentUser?: User
}

export type AuthenticatedContext = BaseContext & {
  currentUser: User
}

export type TrainerContext = BaseContext & {
  currentUser: Trainer
}

export type TraineeContext = BaseContext & {
  currentUser: Trainee
}

export type AdminContext = BaseContext & {
  currentUser: Admin
}

export type LambdaContext = {
  event: APIGatewayProxyEvent
  context: AWSContext
  express: ExpressContext
}
