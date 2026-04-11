const STORAGE_KEY = 'jenny_chat'

export interface StoredMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  timestamp: string
}

export interface StoredChat {
  messages: StoredMessage[]
}

export const storage = {
  load(): StoredMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data) as StoredChat
        return parsed.messages || []
      }
    } catch (e) {
      console.error('Failed to load chat:', e)
    }
    return []
  },

  save(messages: StoredMessage[]) {
    try {
      const data: StoredChat = { messages }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save chat:', e)
    }
  },

  addMessage(message: StoredMessage) {
    const messages = this.load()
    messages.push(message)
    this.save(messages)
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear chat:', e)
    }
  }
}