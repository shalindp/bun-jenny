import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useServerStore } from './server'
import { storage, type StoredMessage } from '../services/storage'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  timestamp: Date
}

export type FaceState = 'idle' | 'listening' | 'speaking' | 'happy' | 'sad' | 'thinking'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const faceState = ref<FaceState>('idle')
  const isSpeaking = ref(false)
  const replayingId = ref<string | null>(null)
  const hasInitialized = ref(false)
  
  const server = useServerStore()

  const loadFromStorage = () => {
    const stored = storage.load()
    messages.value = stored.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }))
  }

  const saveToStorage = () => {
    const toStore: StoredMessage[] = messages.value.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      reasoning: m.reasoning,
      timestamp: m.timestamp.toISOString()
    }))
    storage.save(toStore)
  }

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    messages.value.push(userMessage)
    saveToStorage()
    return userMessage
  }

  const addAssistantMessage = (content: string, reasoning?: string) => {
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      reasoning,
      timestamp: new Date()
    }
    messages.value.push(assistantMessage)
    saveToStorage()
    return assistantMessage
  }

  const sendMessage = async (prompt: string) => {
    if (!server.isInitialized) {
      error.value = 'Server not initialized'
      return
    }

    addUserMessage(prompt)
    loading.value = true
    error.value = null
    faceState.value = 'thinking'

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

      addAssistantMessage(data.response, data.reasoning)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send message'
    } finally {
      loading.value = false
    }
  }

  const sendMessageWithTTS = async (prompt: string, speakResponse: (text: string) => Promise<void>) => {
    if (!server.isInitialized) {
      error.value = 'Server not initialized'
      return
    }

    addUserMessage(prompt)
    loading.value = true
    error.value = null
    faceState.value = 'thinking'

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

      addAssistantMessage(data.response, data.reasoning)
      loading.value = false
      faceState.value = 'speaking'
      isSpeaking.value = true
      
      await speakResponse(data.response)
      
      faceState.value = 'idle'
      isSpeaking.value = false
    } catch (e) {
      faceState.value = 'idle'
      isSpeaking.value = false
      error.value = e instanceof Error ? e.message : 'Failed to send message'
      loading.value = false
    }
  }

  const initializeChat = async () => {
    if (hasInitialized.value) return
    
    faceState.value = 'thinking'
    loading.value = true
    
    try {
      if (!server.isInitialized) {
        await server.initialize()
      }
      
      if (server.initResponse) {
        addAssistantMessage(server.initResponse.response, server.initResponse.reasoning)
      }
      
      hasInitialized.value = true
    } catch (e) {
      error.value = 'Failed to initialize chat'
    } finally {
      loading.value = false
    }
  }

  const initializeChatWithTTS = async (speakResponse: (text: string) => Promise<void>) => {
    if (hasInitialized.value) return
    
    faceState.value = 'thinking'
    loading.value = true
    
    try {
      if (!server.isInitialized) {
        await server.initialize()
      }
      
      if (server.initResponse) {
        addAssistantMessage(server.initResponse.response, server.initResponse.reasoning)
        
        loading.value = false
        faceState.value = 'speaking'
        isSpeaking.value = true
        
        await speakResponse(server.initResponse.response)
        
        faceState.value = 'idle'
        isSpeaking.value = false
      }
      
      hasInitialized.value = true
    } catch (e) {
      faceState.value = 'idle'
      loading.value = false
      error.value = 'Failed to initialize chat'
    }
  }

  const replayMessage = async (text: string, id: string, speakResponse: (text: string) => Promise<void>) => {
    if (replayingId.value !== null) return
    replayingId.value = id
    faceState.value = 'speaking'
    isSpeaking.value = true
    await speakResponse(text)
    faceState.value = 'idle'
    isSpeaking.value = false
    replayingId.value = null
  }

  const clearMessages = () => {
    messages.value = []
    error.value = null
    hasInitialized.value = false
    storage.clear()
  }

  const setFaceState = (state: FaceState) => {
    faceState.value = state
  }

  const setIsSpeaking = (speaking: boolean) => {
    isSpeaking.value = speaking
  }

  return { 
    messages, 
    loading, 
    error, 
    faceState,
    isSpeaking,
    replayingId,
    hasInitialized,
    loadFromStorage,
    saveToStorage,
    addUserMessage,
    addAssistantMessage,
    sendMessage, 
    sendMessageWithTTS,
    initializeChat,
    initializeChatWithTTS,
    replayMessage,
    clearMessages,
    setFaceState,
    setIsSpeaking
  }
})