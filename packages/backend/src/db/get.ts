import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { dbClient } from './ddb'

/**
 * Gets an item from the DB. Get can only be called
 * with the key/index of the table.
 * @param tablename Name of DDB table
 * @param key Identifier of the DDB item
 * @returns Item from DB
 */
export const getItem = async <T>(tablename: string, key: DocumentClient.Key): Promise<T | undefined> => {
  const res = await dbClient().get({ TableName: tablename, Key: key }).promise()

  if (res.$response.error || !res.Item) {
    return undefined
  }

  return res.Item as T
}
