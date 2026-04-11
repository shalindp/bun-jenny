import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  timestamp: Date
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function sendMessage(prompt: string) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }
    messages.value.push(userMessage)
    loading.value = true
    error.value = null

    try {
      const res = await fetch('http://localhost:3000/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json() as { response: string; reasoning: string }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        reasoning: data.reasoning,
        timestamp: new Date()
      }
      messages.value.push(assistantMessage)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send message'
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
    error.value = null
  }

  return { messages, loading, error, sendMessage, clearMessages }
})