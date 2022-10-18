import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { dbClient } from './ddb'

/**
 * Removes a item from the DDB. Delete can only be
 * called with the key/index of the item
 * @param tableName Name of DDB table
 * @param key Key of DDB item
 * @returns true if success
 */
export const deleteItem = async (tableName: string, key: DocumentClient.Key): Promise<boolean> => {
  const res = await dbClient().delete({ TableName: tableName, Key: key }).promise()

  if (res.$response.error) {
    throw new Error('Error deleting item from DB')
  }

  return true
}
