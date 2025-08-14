import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { dbClient } from './ddb'

/**
 * Removes a item from the DDB. Delete can only be
 * called with the key/index of the item
 * @param tableName Name of DDB table
 * @param key Key of DDB item
 * @returns true if success
 */
export const deleteItem = async (tableName: string, key: DeleteCommandInput['Key']): Promise<boolean> => {
  const client = dbClient()
  try {
    await client.send(
      new DeleteCommand({
        TableName: tableName,
        Key: key,
      })
    )
    return true
  } catch (err) {
    console.error('Error deleting item from DB:', err)
    throw new Error('Error deleting item from DB')
  }
}
