import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Keys } from '../utils/object'
import {
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createKeyConditionExpression,
  dbClient,
} from './ddb'

/**
 * Queries the database. A query operates on GSI's which
 * have to be defined for the database
 * @param tablename Name of the DDB table
 * @param options DDB Query Options
 * @returns Queried items
 */
const queryItems = async <T>(
  tablename: string,
  options: Omit<DocumentClient.QueryInput, 'TableName'>
): Promise<T[]> => {
  const res = await dbClient()
    .query({ ...options, TableName: tablename })
    .promise()

  if (res.$response.error || !res.Items) {
    return []
  }

  // query the database until 'LastEvaluatedKey' is empty
  const paginatedResults = res.LastEvaluatedKey
    ? await queryItems<T>(tablename, {
        ...options,
        ExclusiveStartKey: res.LastEvaluatedKey,
      })
    : []

  return [...paginatedResults, ...res.Items] as T[]
}

/**
 * Query DDB items by creating the needed DDB structs
 * @param tableName Name of DDB table
 * @param index DDB index name
 * @param keyOptions Keys and values to query
 * @param filterOptions Keys and values to filter after the query
 * @returns Items from the DDB
 */
export const queryObjects = <T>(
  tableName: string,
  index: string,
  keyOptions: Partial<T>,
  filterOptions: Partial<T> = {}
): Promise<T[]> => {
  const keyConditionKeys = Object.keys(keyOptions) as Keys<Partial<T>>

  // DDB key/index condition structs
  const keyConditionValues = createExpressionAttributeValues(keyOptions as T, keyConditionKeys)
  const keyConditionNames = createExpressionAttributeNames(keyConditionKeys)
  const keyConditionExpression = createKeyConditionExpression(keyConditionKeys)

  const filterConditionKeys = Object.keys(filterOptions) as Keys<Partial<T>>

  // DDB filter structs that run after the key condition
  const filterConditionValues = createExpressionAttributeValues(filterOptions as T, filterConditionKeys)
  const filterConditionNames = createExpressionAttributeNames(filterConditionKeys)
  const filterConditionExpression = createKeyConditionExpression(filterConditionKeys) || undefined

  return queryItems(tableName, {
    IndexName: index,
    ExpressionAttributeValues: { ...keyConditionValues, ...filterConditionValues },
    ExpressionAttributeNames: { ...keyConditionNames, ...filterConditionNames },
    KeyConditionExpression: keyConditionExpression,
    FilterExpression: filterConditionExpression,
  })
}
