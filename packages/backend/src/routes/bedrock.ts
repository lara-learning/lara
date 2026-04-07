import { BedrockRuntimeClient, ConverseCommand, Message, Tool } from '@aws-sdk/client-bedrock-runtime'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

const apiKey = process.env.AWS_BEARER_TOKEN_BEDROCK
if (!apiKey) {
  throw new Error('AWS_BEARER_TOKEN_BEDROCK environment variable is not set')
}

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  token: { token: apiKey },
})

const modelId = 'us.anthropic.claude-4-5-haiku-20241022-v1:0'

const systemPrompt = `Du bist ein erfahrener Ausbilder, der Auszubildenden
hilft ihre Berichtshefte zu verbessern.
Du korrigierst Berichtshefte, wo der Nutzer
schreibt was er oder sie an einem Tag auf der Arbeit gemacht hat.
Dutze den Nutzer und benutze keine Emojis.`

const userPromptTemplate = `Für jeden Eintrag antworte in Stichpunkten:
- Ob der Eintrag verständlich ist
- Ob Grammatik und Rechtschreibung stimmen
- Ein kurzer Vorschlag wie man es besser schreiben könnte
- Fragen wenn du denkst es könnte noch etwas fehlen
<entries>
{{INPUT_TEXT}}
</entries>`

const feedbackTool: Tool = {
  toolSpec: {
    name: 'entry_feedback',
    description: 'Feedback for each report entry in order',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                result: { type: 'string' },
              },
              required: ['result'],
            },
          },
        },
        required: ['results'],
      },
    },
  },
}

export async function getBedrockResponse(inputText: string[]): Promise<string[]> {
  const formatted = inputText.map((text) => `- ${text}`).join('\n')
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
    toolConfig: {
      tools: [feedbackTool],
      toolChoice: { tool: { name: 'entry_feedback' } },
    },
  })

  const response = await client.send(command)

  const toolUseBlock = response.output?.message?.content?.find((b) => b.toolUse)?.toolUse
  if (!toolUseBlock?.input) throw new Error('No tool use content in response')

  const parsed = toolUseBlock.input as { results: { result: string }[] }
  return parsed.results.map((item) => item.result)
}
