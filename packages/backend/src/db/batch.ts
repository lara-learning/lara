import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { dbClient } from './ddb'

/**
 * Writes a batch to the DDB. A batch contains multiple delete or put
 * requests. This should be used if a lot of items need updates so
 * we don't run into DDB access limits
 * @param items max. 25 request items
 * @returns true if success
 */
export const batchWriteItem = async (items: DocumentClient.BatchWriteItemInput['RequestItems']): Promise<boolean> => {
  const res = await dbClient().batchWrite({ RequestItems: items }).promise()

  if (res.$response.error) {
    throw new Error('Error batch writing to DB')
  }

  return true
}
