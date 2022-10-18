import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Keys } from '../utils/object'
import {
  attributeNameKey,
  attributeValueKey,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  dbClient,
} from './ddb'

/**
 * Updates a item in the DDB.
 * @param tableName Name of DDB table
 * @param input DDB input options
 * @returns Boolean if sucess
 */
const updateItem = async (
  tableName: string,
  input: Omit<DocumentClient.UpdateItemInput, 'TableName'>
): Promise<boolean> => {
  const res = await dbClient()
    .update({ TableName: tableName, ...input })
    .promise()

  if (res.$response.error) {
    throw new Error('Error updating into DB')
  }

  return true
}

/**
 * Creates String to update DDB which
 * looks like this: 'SET #key = :key'
 * @param keys The Object-Keys that are contain new values
 * @returns DDB String to update the DB
 */
const createUpdateExpression = (keys: string[]): string =>
  keys.length > 0 ? `SET ${keys.map((key) => `${attributeNameKey(key)} = ${attributeValueKey(key)}`)}` : ''

/**
 * Creates String to update DDB which
 * looks like this: 'REMOVE #key'
 * @param keys The Object-kEys that will be removed
 * @returns DDB String to remove from DB
 */
const createRemoveExpression = (keys: string[]): string =>
  keys.length > 0 ? `REMOVE ${keys.map(attributeNameKey)}` : ''

export type UpdateObjectOptions<T> = {
  updateKeys?: Keys<T>
  removeKeys?: Keys<T>
}

/**
 * Updates DDB object by creating the needed DDB structs
 * @param tableName Name of DDB table
 * @param updatedObject Object with new values
 * @param options The keys to update and remove
 * @returns The updated object
 */
export const updateObject = async <T extends { id: string }>(
  tableName: string,
  updatedObject: T,
  options: UpdateObjectOptions<T>
): Promise<T> => {
  if (!options.removeKeys && !options.updateKeys) {
    return updatedObject
  }

  const updateKeys = options.updateKeys ?? []
  const removeKeys = options.removeKeys ?? []

  // the actual db keys are mapped on to placeholders so we dont accidentally use reserved keyword
  const ExpressionAttributeNames = createExpressionAttributeNames([...updateKeys, ...removeKeys])

  // the values are mapped to strings
  const ExpressionAttributeValues =
    updateKeys.length > 0
      ? { ExpressionAttributeValues: createExpressionAttributeValues(updatedObject, updateKeys) }
      : {}

  // the update update expression creates SET #attributeNames = :attributeValue
  const UpdateUpdateExpression = createUpdateExpression(updateKeys)

  // the remove update expression creates Remove #attributeNames, ...
  const RemoveUpdateExpression = createRemoveExpression(removeKeys)

  await updateItem(tableName, {
    Key: { id: updatedObject.id },
    ExpressionAttributeNames,
    ...ExpressionAttributeValues,
    UpdateExpression: `${UpdateUpdateExpression} ${RemoveUpdateExpression}`,
  })

  // remove the values for the returned object
  removeKeys.forEach((key) => {
    delete updatedObject[key]
  })

  return updatedObject
}
