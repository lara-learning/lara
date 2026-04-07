import { Request, Response } from 'express'
import { getBedrockResponse } from './bedrock'

export const handleAIRequest = async (req: Request, res: Response) => {
  const { entries } = req.body as {
    entries: Array<{ id: string; text: string }>
  }

  if (!entries || entries.length === 0) {
    return res.status(400).json({ error: 'entries required' })
  }

  try {
    const texts = entries.map((e) => e.text)
    const feedbacks = await getBedrockResponse(texts)
    return res.json({
      results: entries.map((e: { id: string; text: string }, index: number) => ({
        id: e.id,
        result: feedbacks[index],
      })),
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Failed to get LLM response' })
  }
}
