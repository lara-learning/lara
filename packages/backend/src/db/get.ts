import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { dbClient } from './ddb'

/**
 * Gets an item from the DB. Get can only be called
 * with the key/index of the table.
 * @param tablename Name of DDB table
 * @param key Identifier of the DDB item
 * @returns Item from DB
 */
export const getItem = async <T>(tablename: string, key: GetCommandInput['Key']): Promise<T | undefined> => {
  const client = dbClient()
  try {
    const res = await client.send(
      new GetCommand({
        TableName: tablename,
        Key: key,
      })
    )
    return res.Item as T | undefined
  } catch (err) {
    console.error('Error fetching item from DDB:', err)
    return undefined
  }
}
