import { DocumentClient } from 'aws-sdk/clients/dynamodb'

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
  additionalInput?: Omit<DocumentClient.ScanInput, 'TableName'>
): Promise<T[]> => {
  const res = await dbClient()
    .scan({ TableName: tablename, ...additionalInput })
    .promise()

  if (res.$response.error || !res.Items) {
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
}
