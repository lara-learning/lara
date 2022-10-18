import { GqlResolvers, BaseContext, TraineeContext } from '@lara/api'
import { GraphQLError } from 'graphql'
import { traineeById } from '../repositories/trainee.repo'

export const paperResolver: GqlResolvers<TraineeContext | BaseContext> = {
  Paper: {
    trainee: async (model) => {
      const trainee = await traineeById(model.traineeId)
      if (!trainee) {
        throw new GraphQLError('Wrong traineeId!')
      }

      return trainee
    },
  },
  Query: {},
  Mutation: {},
}
