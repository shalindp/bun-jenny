import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServerStore = defineStore('server', () => {
  const isHealthy = ref(false)
  const checking = ref(false)
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

  return { isHealthy, checking, checkHealth, startPolling, stopPolling }
})