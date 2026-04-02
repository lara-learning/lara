import { BedrockRuntimeClient, ConverseCommand, Message } from '@aws-sdk/client-bedrock-runtime'
import 'dotenv/config'

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
const systemPrompt =
  'Du bist ein hilfreicher Assistent für Azubis um ihnen zu helfen ihre Berichtshefte ordentlich zu schreiben.'

const userPromptTemplate = `Gebe dem User Tipps aber schreibe es nicht für ihn. Aussagekräftige Stichpunkte sind zulässig und Kurze Sätze. Rechtschreibung und Grammatik solltest du korrigieren und inhaltlich nur kommentieren wie man es besser schreiben könnte. Falls zu wenig input vom Azubi kommt stelle gezielt Fragen damit der Azubi auf neue Ideen kommt
<text>
{{INPUT_TEXT}}
</text>`

export async function getBedrockResponse(inputText: string): Promise<string> {
  const userPrompt = userPromptTemplate.replace('{{INPUT_TEXT}}', inputText)

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

  if (!outputText) {
    throw new Error('No text content in response')
  }

  return outputText
}
