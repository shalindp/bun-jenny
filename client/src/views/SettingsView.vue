<template>
  <div class="flex-1 overflow-y-auto px-6 py-8 pb-8">
    <div class="max-w-xl mx-auto">
      <h1 class="text-2xl font-bold text-text-primary mb-8">Settings</h1>

      <!-- Text-to-Speech (TTS) -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold mb-4">Text-to-Speech (TTS)</h2>
        <p class="text-text-muted text-sm mb-4">
          Configure how Jenny speaks. Changes apply immediately.
        </p>

        <!-- Voice Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-text-primary mb-2">
            Voice
          </label>
          <select 
            v-if="englishVoices.length > 0"
            :value="tts.currentVoice.value?.name"
            @change="onVoiceChange"
            class="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg focus:border-pink focus:outline-none text-white"
          >
            <option 
              v-for="voice in englishVoices" 
              :key="voice.name" 
              :value="voice.name"
            >
              {{ voice.name }}
            </option>
          </select>
          <p v-else class="text-text-muted text-sm">
            Loading voices...
          </p>
        </div>

        <!-- Pitch -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-text-primary">
              Pitch
            </label>
            <span class="text-sm text-text-muted">{{ tts.pitch.value.toFixed(1) }}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1"
            :value="tts.pitch.value"
            @input="onPitchChange"
            class="w-full h-2 bg-bg-input rounded-lg appearance-none cursor-pointer accent-pink"
          />
          <div class="flex justify-between text-xs text-text-muted mt-1">
            <span>Lower</span>
            <span>Higher</span>
          </div>
        </div>

        <!-- Speed -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-text-primary">
              Speed
            </label>
            <span class="text-sm text-text-muted">{{ tts.rate.value.toFixed(1) }}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1"
            :value="tts.rate.value"
            @input="onRateChange"
            class="w-full h-2 bg-bg-input rounded-lg appearance-none cursor-pointer accent-pink"
          />
          <div class="flex justify-between text-xs text-text-muted mt-1">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>

        <!-- Preview Button -->
        <button 
          @click="previewSettings"
          :disabled="tts.isSpeaking.value"
          class="btn-primary w-full disabled:opacity-50"
        >
          {{ tts.isSpeaking.value ? 'Speaking...' : 'Preview Settings' }}
        </button>
      </div>

      <!-- System Info -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">System Information</h2>
        
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-text-muted">TTS Support</span>
            <span :class="tts.isSupported.value ? 'text-success' : 'text-error'">
              {{ tts.isSupported.value ? 'Available' : 'Not Available' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-muted">Input Method</span>
            <span class="text-text-muted">macOS Dictation</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-muted">LLM</span>
            <span class="text-text-muted">Server (qwen2.5:7b)</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-border">
            <span class="text-text-muted">Debug Mode</span>
            <button 
              @click="toggleDebug"
              class="relative w-12 h-6 rounded-full transition-colors duration-200"
              :class="settings.debugMode ? 'bg-pink' : 'bg-bg-secondary'"
            >
              <span 
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                :class="settings.debugMode ? 'left-7' : 'left-1'"
              ></span>
            </button>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-border">
            <span class="text-text-muted">Text-to-Speech</span>
            <button 
              @click="toggleTts"
              class="relative w-12 h-6 rounded-full transition-colors duration-200"
              :class="settings.ttsEnabled ? 'bg-pink' : 'bg-bg-secondary'"
            >
              <span 
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                :class="settings.ttsEnabled ? 'left-7' : 'left-1'"
              ></span>
            </button>
          </div>
          <div class="pt-4 mt-2 border-t border-border">
            <button 
              @click="resetAll"
              class="w-full px-4 py-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors text-sm font-medium"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTTS } from '../composables/useTTS'
import { useSettingsStore } from '../stores/settings'

const tts = useTTS()
const settings = useSettingsStore()

const englishVoices = computed(() => {
  return tts.voices.value.filter(v => v.lang.startsWith('en'))
})

const onVoiceChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const voiceName = target.value
  const voice = tts.voices.value.find(v => v.name === voiceName)
  if (voice) {
    tts.setVoice(voice)
  }
}

const onPitchChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  tts.setPitch(parseFloat(target.value))
}

const onRateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  tts.setRate(parseFloat(target.value))
}

const previewSettings = () => {
  tts.speak("Hello! This is how I'll sound with these settings.")
}

const toggleDebug = () => {
  settings.setDebugMode(!settings.debugMode)
}

const toggleTts = () => {
  settings.setTtsEnabled(!settings.ttsEnabled)
}

const resetAll = () => {
  if (confirm('Are you sure you want to reset all data? This will clear your chat history and settings.')) {
    localStorage.clear()
    window.location.href = '/chat'
  }
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FF69B4;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FF69B4;
  cursor: pointer;
  border: none;
}
</style>