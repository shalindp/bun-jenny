import { defineStore } from 'pinia'
import { ref } from 'vue'

interface InitResponse {
  response: string
  reasoning: string
}

export const useServerStore = defineStore('server', () => {
  const isHealthy = ref(false)
  const checking = ref(false)
  const isInitialized = ref(false)
  const initializing = ref(false)
  const initResponse = ref<InitResponse | null>(null)
  let intervalId: ReturnType<typeof setInterval> | null = null

  async function checkHealth() {
    checking.value = true
    try {
      const res = await fetch('http://localhost:3000/health')
      isHealthy.value = res.ok
    } catch {
      isHealthy.value = false
    } finally {
      checking.value = false
    }
  }

  async function initialize() {
    if (initializing.value) return
    
    initializing.value = true
    try {
      const res = await fetch('http://localhost:3000/init')
      if (!res.ok) {
        throw new Error(`Init failed: ${res.status}`)
      }
      initResponse.value = await res.json() as InitResponse
      isInitialized.value = true
    } finally {
      initializing.value = false
    }
  }

  function startPolling(intervalMs = 5000) {
    checkHealth()
    intervalId = setInterval(checkHealth, intervalMs)
  }

  function stopPolling() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return { 
    isHealthy, 
    checking, 
    isInitialized, 
    initializing,
    initResponse,
    checkHealth, 
    initialize,
    startPolling, 
    stopPolling 
  }
})