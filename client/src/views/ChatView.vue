<template>
  <div class="flex flex-col h-screen">
    <!-- Jenny Face -->
    <div class="shrink-0 h-[200px] py-3 flex justify-center items-center relative">
      <div 
        v-if="chat.faceState === 'thinking'"
        class="absolute -right-16 top-0 flex flex-col items-center"
      >
        <div class="text-3xl animate-pulse">💡</div>
        <div class="w-1 h-4 bg-yellow-400 animate-pulse"></div>
        <div class="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
      </div>
      <JennyFace :state="chat.faceState" :size="120" />
    </div>
    
    <!-- Chat Area -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto px-6 py-4">
      <!-- Error bar -->
      <div v-if="chat.error" class="mb-4 px-4 py-2 bg-error/20 text-error text-sm text-center rounded-lg">
        {{ chat.error }}
      </div>
      
      <div class="max-w-2xl mx-auto">
        <ChatBubble 
          v-for="msg in chat.messages" 
          :key="msg.id"
          :text="msg.content"
          :reasoning="msg.reasoning"
          :speaker="msg.role === 'assistant' ? 'jenny' : 'kavya'"
          :timestamp="msg.timestamp"
          can-replay
          :is-replaying="chat.replayingId === msg.id"
          @replay="replayMessage(msg.content, msg.id)"
        />
        
        <!-- Loading indicator -->
        <div v-if="chat.loading" class="flex justify-start mb-4">
          <div class="jenny-bubble">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-pink rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-pink rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-pink rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Input Area -->
    <div class="bg-bg-primary border-t border-border h-[150px] py-2">
      <div class="max-w-2xl mx-auto flex flex-col justify-center">
        <div class="flex gap-3">
          <input 
            ref="inputRef"
            v-model="inputText"
            @keydown.enter="submitMessage"
            @input="handleInput"
            type="text"
            placeholder="Type or use Dictation (Fn + Fn) then press Enter"
            class="flex-1 px-4 py-3 bg-bg-secondary border border-border rounded-full focus:border-pink focus:outline-none text-white placeholder:text-text-muted"
            :disabled="chat.loading || tts.isSpeaking.value"
          />
          <button 
            @click="submitMessage"
            :disabled="!inputText.trim() || chat.loading || tts.isSpeaking.value"
            class="px-6 py-3 bg-pink text-white rounded-full hover:bg-pink-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <p class="text-center text-text-muted text-sm mt-2">
          Press <kbd class="px-2 py-1 bg-bg-secondary rounded">Fn</kbd> twice to start Dictation, then press <kbd class="px-2 py-1 bg-bg-secondary rounded">Enter</kbd> to send
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import JennyFace from '../components/JennyFace.vue'
import ChatBubble from '../components/ChatBubble.vue'
import { useChatStore } from '../stores/chat'
import { useServerStore } from '../stores/server'
import { useTTS } from '../composables/useTTS'
import { useSettingsStore } from '../stores/settings'

const chat = useChatStore()
const server = useServerStore()
const tts = useTTS()
const settings = useSettingsStore()

const inputText = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const chatContainer = ref<HTMLElement | null>(null)
const isDebouncing = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const focusInput = () => {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const handleInput = () => {
  clearTimeout(debounceTimer!)
  isDebouncing.value = false
  
  const text = inputText.value.trim()
  if (text && !chat.loading && !tts.isSpeaking.value) {
    isDebouncing.value = true
    debounceTimer = setTimeout(() => {
      isDebouncing.value = false
      submitMessage()
    }, 3500)
  }
}

let lastInputValue = ''

const checkForNewInput = () => {
  if (!inputRef.value) return
  const currentValue = inputRef.value.value || ''
  if (currentValue !== lastInputValue && currentValue.trim()) {
    lastInputValue = currentValue
    inputText.value = currentValue
    handleInput()
  }
}

let checkInterval: ReturnType<typeof setInterval> | null = null

const getDisplayText = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString)
    return parsed.user || jsonString
  } catch {
    return jsonString
  }
}

const submitMessage = async () => {
  const text = inputText.value.trim()
  if (!text || chat.loading || tts.isSpeaking.value) return
  
  isDebouncing.value = false
  clearTimeout(debounceTimer!)
  inputText.value = ''
  chat.faceState = 'thinking'
  
  chat.addUserMessage(text)
  await nextTick()
  scrollToBottom()
  
  try {
    const res = await fetch('http://localhost:3000/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text })
    })

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`)
    }

    const data = await res.json() as { response: string; reasoning: string }

    chat.addAssistantMessage(data.response, data.reasoning)
    await nextTick()
    scrollToBottom()
    
    if (settings.ttsEnabled) {
      chat.faceState = 'speaking'
      tts.isSpeaking.value = true
      await tts.speak(getDisplayText(data.response))
      chat.faceState = 'idle'
      tts.isSpeaking.value = false
    }
    focusInput()
  } catch (e) {
    chat.faceState = 'idle'
    tts.isSpeaking.value = false
    chat.error = 'Sorry, something went wrong. Please try again.'
    setTimeout(() => { chat.error = null }, 3000)
    focusInput()
  }
}

const replayMessage = async (text: string, id: string) => {
  if (chat.replayingId !== null) return
  chat.replayingId = id
  
  if (settings.ttsEnabled) {
    chat.faceState = 'speaking'
    tts.isSpeaking.value = true
    await tts.speak(getDisplayText(text))
    chat.faceState = 'idle'
    tts.isSpeaking.value = false
  }
  chat.replayingId = null
  focusInput()
}

watch(() => tts.isSpeaking.value, (speaking) => {
  if (speaking) {
    chat.faceState = 'speaking'
    isDebouncing.value = false
    clearTimeout(debounceTimer!)
  } else {
    chat.faceState = 'idle'
    focusInput()
  }
})

onMounted(async () => {
  focusInput()
  lastInputValue = inputRef.value?.value || ''
  checkInterval = setInterval(checkForNewInput, 200)
  
  chat.loadFromStorage()
  
  await server.initialize()
  
  if (server.initResponse && chat.messages.length === 0) {
    chat.faceState = 'thinking'
    chat.loading = true
    
    chat.addAssistantMessage(server.initResponse.response, server.initResponse.reasoning)
    
    chat.loading = false
    await nextTick()
    scrollToBottom()
    
    if (settings.ttsEnabled) {
      chat.faceState = 'speaking'
      tts.isSpeaking.value = true
      await tts.speak(getDisplayText(server.initResponse.response))
      chat.faceState = 'idle'
      tts.isSpeaking.value = false
    }
    chat.hasInitialized = true
  } else {
    chat.hasInitialized = true
    await nextTick()
    scrollToBottom()
  }
  
  focusInput()
})

onUnmounted(() => {
  clearTimeout(debounceTimer!)
  if (checkInterval) clearInterval(checkInterval)
})
</script>