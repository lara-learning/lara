import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb'

import { dbClient } from './ddb'

/**
 * Scans the entire database for items.
 * This should be avoided since it's scanning every row in our table
 * which could lead to very long read operations
 * @param tablename Name of the DDB table
 * @param additionalInput DDB scan options
 * @returns All Items from the table
 */
export const scanItems = async <T>(
  tablename: string,
  additionalInput?: Omit<ScanCommandInput, 'TableName'>
): Promise<T[]> => {
  const client = dbClient()

  try {
    const res = await client.send(
      new ScanCommand({
        TableName: tablename,
        ...additionalInput,
      })
    )

    if (!res.Items) {
      return []
    }

    // scan the database until 'LastEvaluatedKey' is empty
    const paginatedResults = res.LastEvaluatedKey
      ? await scanItems<T>(tablename, {
          ...additionalInput,
          ExclusiveStartKey: res.LastEvaluatedKey,
        })
      : []

    return [...paginatedResults, ...res.Items] as T[]
  } catch (error) {
    console.error('Error while scanning the DB:', error)
    throw new Error('Error while scanning the DB:')
  }
}
