import { addSeconds } from 'date-fns'

import { User } from '@lara/api'

import {
  deleteItem,
  getItem,
  putItem,
  queryObjects,
  scanItems,
  updateObject,
  UpdateObjectOptions,
  userEmailIndex,
  userOAuthCodeIndex,
  userTableName,
} from '../db'
import { TokensResponse } from '../services/oauth.service'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const allUsers = (): Promise<User[]> => {
  return scanItems(userTableName)
}

export const saveUser = <T extends DocumentClient.PutItemInputAttributeMap>(user: T): Promise<T> => {
  return putItem(userTableName, user)
}

export const updateUser = async <T extends User>(updatedTrainee: T, options: UpdateObjectOptions<T>): Promise<T> => {
  return updateObject(userTableName, updatedTrainee, options)
}

export const deleteUser = (user: User): Promise<boolean> => {
  return deleteItem(userTableName, { id: user.id })
}

export const userById = <T = User>(id: string): Promise<T | undefined> => {
  return getItem(userTableName, { id })
}

export const userByEmail = async (email: string): Promise<User | undefined> => {
  const users = await queryObjects<User>(userTableName, userEmailIndex, { email })
  return users[0]
}

type SaveTokenResponseOptions = {
  user: User
  response: TokensResponse
  removeState?: boolean
}

export const saveTokenResponse = async ({ user, response, removeState }: SaveTokenResponseOptions): Promise<User> => {
  const { access_token, refresh_token, expires_in } = response

  user.amazonAccessToken = access_token
  user.amazonRefreshToken = refresh_token
  user.amazonRefreshDate = addSeconds(new Date(), expires_in).toISOString()

  return updateUser(user, {
    updateKeys: ['amazonAccessToken', 'amazonRefreshDate', 'amazonRefreshToken'],
    removeKeys: removeState ? ['oAuthState'] : [],
  })
}

export const userByOAuthCode = async (code: string): Promise<User | undefined> => {
  const users = await queryObjects<User>(userTableName, userOAuthCodeIndex, { oAuthCode: code })
  return users[0]
}
