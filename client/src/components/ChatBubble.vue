<template>
  <div 
    class="flex mb-4"
    :class="isJenny ? 'justify-start' : 'justify-end'"
  >
    <div 
      class="max-w-[80%] rounded-2xl px-4 py-3"
      :class="[
        isJenny 
          ? 'bg-bg-card border border-pink-dark rounded-bl-none' 
          : 'bg-bg-secondary rounded-tr-none'
      ]"
    >
      <p v-if="isJenny && isDebugMode" class="text-text-muted text-xs font-mono whitespace-pre-wrap break-all">{{ text }}</p>
      <p v-else class="text-text-primary whitespace-pre-wrap">{{ displayText }}</p>
      
      <div v-if="isJenny && isDebugMode && reasoning" class="mt-2 pt-2 border-t border-border">
        <p class="text-text-muted italic text-xs">{{ reasoning }}</p>
      </div>
      
      <div class="flex items-center justify-between mt-2 gap-4">
        <span class="text-xs text-text-muted">
          {{ formattedTime }}
        </span>
        
        <button 
          v-if="isJenny && canReplay"
          @click="$emit('replay', replayText)"
          class="flex items-center gap-1 text-xs text-pink hover:text-pink-light transition-colors"
          :class="{ 'animate-pulse': isReplaying }"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            />
          </svg>
          <span>Replay</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const props = defineProps<{
  text: string
  reasoning?: string
  speaker: 'jenny' | 'kavya'
  timestamp?: Date
  canReplay?: boolean
  isReplaying?: boolean
}>()

defineEmits<{
  replay: [text: string]
}>()

const settings = useSettingsStore()
const isDebugMode = computed(() => settings.debugMode)

const isJenny = computed(() => props.speaker === 'jenny')

const displayText = computed(() => {
  if (props.speaker === 'kavya') {
    return props.text
  }
  
  try {
    const parsed = JSON.parse(props.text)
    return parsed.user || props.text
  } catch {
    return props.text
  }
})

const replayText = computed(() => {
  try {
    const parsed = JSON.parse(props.text)
    return parsed.user || props.text
  } catch {
    return props.text
  }
})

const formattedTime = computed(() => {
  const ts = props.timestamp || new Date()
  return ts.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})
</script>