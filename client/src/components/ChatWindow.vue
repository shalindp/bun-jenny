<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '../stores/chat'
import { storeToRefs } from 'pinia'
import ChatMessage from './ChatMessage.vue'

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
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
        <p class="text-lg">Start a conversation</p>
        <p class="text-sm">Send a message to begin chatting with Jenny</p>
      </div>
      
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id" 
        :message="message" 
      />
      
      <div v-if="loading" class="flex items-start">
        <div class="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
        {{ error }}
      </div>
      
      <div ref="messagesEnd"></div>
    </div>
    
    <form @submit.prevent="send" class="p-4 border-t border-gray-200">
      <div class="flex gap-2">
        <input
          v-model="input"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading || !input.trim()"
        >
          Send
        </button>
      </div>
    </form>
  </div>
</template>