import { BedrockRuntimeClient, ConverseCommand, Message } from '@aws-sdk/client-bedrock-runtime'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })
// Load API key from environment variable
const apiKey = process.env.AWS_BEARER_TOKEN_BEDROCK
if (!apiKey) {
  throw new Error('AWS_BEARER_TOKEN_BEDROCK environment variable is not set')
}

// Create the Bedrock client
const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  token: { token: apiKey },
})

// Define the model
const modelId = 'us.anthropic.claude-3-5-haiku-20241022-v1:0'

// Prompts
const systemPrompt = 'Du korrigierst Berichtshefte in einem kurzen Satz pro Eintrag'

const userPromptTemplate = `Für jeden Eintrag sage in einem kurzen Satz ob es Gemüse, Obst oder etwas anderes ist.
Antworte NUR mit einem JSON-Array in dieser Form, ein Objekt pro Eintrag, in der gleichen Reihenfolge:
[{"result": "..."}, {"result": "..."}]

<entries>
{{INPUT_TEXT}}
</entries>`

export async function getBedrockResponse(inputText: string[]): Promise<string[]> {
  const formatted = inputText.map((text, i) => `${i + 1}. ${text}`).join('\n')
  const userPrompt = userPromptTemplate.replace('{{INPUT_TEXT}}', formatted)

  const messages: Message[] = [
    {
      role: 'user',
      content: [{ text: userPrompt }],
    },
  ]

  const command = new ConverseCommand({
    modelId,
    system: [{ text: systemPrompt }],
    messages,
  })

  const response = await client.send(command)
  const outputText = response.output?.message?.content?.[0]?.text
  if (!outputText) throw new Error('No text content in response')

  const parsed: { result: string }[] = JSON.parse(outputText)
  return parsed.map((item) => item.result)
}

// async function main() {
//   const inputText = 'viele meetings nichts gemacht'
//   const result = await getBedrockResponse(inputText)
//   console.log(result)
// }

// main()
