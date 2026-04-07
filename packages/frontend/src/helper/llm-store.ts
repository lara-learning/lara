export interface LlmEntryResult {
  id: string
  result: string
}

export interface LlmResponse {
  results: LlmEntryResult[]
}

type Subscriber = (response: LlmResponse | null) => void

class LlmStore {
  private response: LlmResponse | null = null
  private subscribers: Subscriber[] = []
  private static instance: LlmStore

  private constructor() {}

  static getInstance(): LlmStore {
    if (!LlmStore.instance) LlmStore.instance = new LlmStore()
    return LlmStore.instance
  }

  subscribe(cb: Subscriber): () => void {
    this.subscribers.push(cb)
    cb(this.response)
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb)
    }
  }

  setResponse(response: LlmResponse) {
    this.response = response
    this.subscribers.forEach((cb) => cb(this.response))
  }

  getResponse() {
    return this.response
  }
}

export const llmStore = (): LlmStore => {
  return LlmStore.getInstance()
}

//export const llmStore = LlmStore.getInstance()
