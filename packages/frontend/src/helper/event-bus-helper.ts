type EventMap = {
  avatarUpdated: undefined
}

type EventKey = keyof EventMap
type EventCallback<K extends EventKey> = (data: EventMap[K]) => void

class EventBus {
  private listeners: { [key: string]: unknown[] } = {}

  on<K extends EventKey>(event: K, callback: EventCallback<K>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    ;(this.listeners[event] as EventCallback<K>[]).push(callback)
  }

  off<K extends EventKey>(event: K, callback: EventCallback<K>): void {
    if (this.listeners[event]) {
      this.listeners[event] = (this.listeners[event] as EventCallback<K>[]).filter((listener) => listener !== callback)
    }
  }

  emit<K extends EventKey>(event: K, data: EventMap[K]): void {
    ;(this.listeners[event] as EventCallback<K>[] | undefined)?.forEach((listener) => listener(data))
  }
}

const eventBus = new EventBus()
export default eventBus
