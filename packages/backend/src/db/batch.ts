import { BatchWriteCommand, BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { dbClient } from './ddb'

/**
 * Writes a batch to the DDB. A batch contains multiple delete or put
 * requests. This should be used if a lot of items need updates so
 * we don't run into DDB access limits
 * @param items max. 25 request items
 * @returns true if success
 */
export const batchWriteItem = async (items: BatchWriteCommandInput['RequestItems']): Promise<boolean> => {
  const client = dbClient()
  try {
    const res = await client.send(
      new BatchWriteCommand({
        RequestItems: items,
      })
    )

    if (res.UnprocessedItems && Object.keys(res.UnprocessedItems).length > 0) {
      console.warn('Some items were unprocessed:', res.UnprocessedItems)
    }

    return true
  } catch (err) {
    console.error('Error batch writing to DB:', err)
    throw new Error('Error batch writing to DB')
  }
}
