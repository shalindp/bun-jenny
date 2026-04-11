import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'jenny_settings'

export const useSettingsStore = defineStore('settings', () => {
  const debugMode = ref(false)
  const ttsEnabled = ref(true)

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const settings = JSON.parse(saved)
        debugMode.value = settings.debugMode ?? false
        ttsEnabled.value = settings.ttsEnabled ?? true
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }

  const setDebugMode = (value: boolean) => {
    debugMode.value = value
    saveSettings()
  }

  const setTtsEnabled = (value: boolean) => {
    ttsEnabled.value = value
    saveSettings()
  }

  const saveSettings = () => {
    try {
      const settings = {
        debugMode: debugMode.value,
        ttsEnabled: ttsEnabled.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  loadSettings()

  return {
    debugMode,
    ttsEnabled,
    setDebugMode,
    setTtsEnabled
  }
})