import { applyMiddleware } from 'graphql-middleware'
import { graphql } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { gqlSchema } from '@lara/api'

import { permissions } from '../permissions'

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: gqlSchema,
    resolvers: {
      Query: {
        cleanup: () => true,
        config: () => ({ minWorkDayMinutes: 480 }),
      },
    },
  }),
  permissions
)

describe('GraphQL permissions', () => {
  it('does not expose development login or usertype mutations', () => {
    const mutationFields = schema.getMutationType()?.getFields()

    expect(mutationFields).not.toHaveProperty('_devloginuser')
    expect(mutationFields).not.toHaveProperty('_devsetusertype')
  })

  it('denies cleanup to unauthenticated users', async () => {
    const result = await graphql({ schema, source: '{ cleanup }', contextValue: {} })

    expect(result.errors?.[0].message).toBe('Not Authorised!')
  })

  it('denies cleanup to non-admin users', async () => {
    const result = await graphql({
      schema,
      source: '{ cleanup }',
      contextValue: { currentUser: { type: 'Trainee' } },
    })

    expect(result.errors?.[0].message).toBe('Wrong Usertype')
  })

  it('allows authenticated config access including nested config fields', async () => {
    const result = await graphql({
      schema,
      source: '{ config { minWorkDayMinutes } }',
      contextValue: { currentUser: { type: 'Trainee' } },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ config: { minWorkDayMinutes: 480 } })
  })

  it('allows cleanup only to admins', async () => {
    const result = await graphql({
      schema,
      source: '{ cleanup }',
      contextValue: { currentUser: { type: 'Admin' } },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ cleanup: true })
  })
})
