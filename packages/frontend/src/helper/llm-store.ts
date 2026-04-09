// LLM response type
export interface LlmResponse {
  result: string
  // add any other metadata if needed
}

// Singleton store
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

  // Subscribe to changes
  subscribe(cb: Subscriber): () => void {
    this.subscribers.push(cb)
    // immediately call with current value
    cb(this.response)
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb)
    }
  }

  // Set new response and notify subscribers
  setResponse(response: LlmResponse) {
    this.response = response

    this.subscribers.forEach((cb) => cb(this.response))
  }

  // Accessor
  getResponse() {
    return this.response
  }
}

export const llmStore = LlmStore.getInstance()
