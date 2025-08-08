import { PutCommand } from '@aws-sdk/lib-dynamodb'

import { dbClient } from './ddb'

/**
 * Writes an item to the DDB. If the item already
 * exists it will be overwritten
 * @param tableName Name of DDB table
 * @param input DDB put options
 * @returns The input if successfull
 */
export const putItem = async <T extends Record<string, unknown>>(tableName: string, input: T): Promise<T> => {
  const client = dbClient()
  try {
    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: input,
      })
    )
    return input
  } catch (error) {
    console.error('Error putting Item into DB', error)
    throw new Error('Error putting Item into DB')
  }
}
