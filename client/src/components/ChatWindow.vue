<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '../stores/chat'
import { storeToRefs } from 'pinia'
import ChatMessage from './ChatMessage.vue'

defineProps<{
  disabled?: boolean
}>()

const chat = useChatStore()
const { messages, loading, error } = storeToRefs(chat)
const input = ref('')
const messagesEnd = ref<HTMLElement | null>(null)

watch(messages, async () => {
  await nextTick()
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
})

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  await chat.sendMessage(text)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="messages.length === 0 && !disabled" class="text-center mt-8" style="color: var(--text)">
        <p class="text-lg opacity-80">Start a conversation</p>
        <p class="text-sm opacity-50">Send a message to begin chatting with Jenny</p>
      </div>
      
      <div v-if="disabled" class="text-center mt-8" style="color: var(--text)">
        <p class="text-lg opacity-80">Initializing...</p>
        <p class="text-sm opacity-50">Please wait while Jenny gets ready</p>
      </div>
      
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id" 
        :message="message" 
      />
      
      <div v-if="loading" class="flex items-start">
        <div class="px-4 py-3 rounded-3xl rounded-bl-md" style="background: var(--jenny-bubble)">
          <div class="flex gap-1">
            <span class="w-2 h-2 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 0ms"></span>
            <span class="w-2 h-2 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 150ms"></span>
            <span class="w-2 h-2 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="p-3 rounded-lg text-sm" style="background: #3a1a1a; color: #f87171">
        {{ error }}
      </div>
      
      <div ref="messagesEnd"></div>
    </div>
    
    <form @submit.prevent="send" class="p-4" style="border-top: 1px solid var(--border)">
      <div class="flex gap-2">
        <input
          v-model="input"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-3 rounded-2xl transition-all placeholder:text-white/30"
          style="background: var(--surface); border: 1px solid var(--border); color: var(--text-h)"
          :disabled="disabled || loading"
        />
        <button
          type="submit"
          class="px-6 py-3 rounded-2xl transition-all"
          style="background: var(--accent); color: white"
          :disabled="disabled || loading || !input.trim()"
        >
          Send
        </button>
      </div>
    </form>
  </div>
</template>