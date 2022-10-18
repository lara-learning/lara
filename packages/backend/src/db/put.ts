import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { dbClient } from './ddb'

/**
 * Writes an item to the DDB. If the item already
 * exists it will be overwritten
 * @param tableName Name of DDB table
 * @param input DDB put options
 * @returns The input if successfull
 */
export const putItem = async <T>(tableName: string, input: DocumentClient.PutItemInputAttributeMap): Promise<T> => {
  const res = await dbClient().put({ TableName: tableName, Item: input }).promise()

  if (res.$response.error) {
    throw new Error('Error putting into DB')
  }

  return input as T
}
