<script setup lang="ts">
import type { Message } from '../stores/chat'

defineProps<{
  message: Message
}>()
</script>

<template>
  <div 
    class="flex flex-col"
    :class="message.role === 'user' ? 'items-end' : 'items-start'"
  >
    <div 
      class="max-w-[80%] px-4 py-2 rounded-2xl"
      :class="message.role === 'user' 
        ? 'bg-blue-600 text-white rounded-br-md' 
        : 'bg-gray-100 text-gray-900 rounded-bl-md'"
    >
      <p class="whitespace-pre-wrap">{{ message.content }}</p>
    </div>
    <div 
      v-if="message.reasoning" 
      class="mt-1 text-xs text-gray-400 italic max-w-[80%] px-2"
    >
      {{ message.reasoning }}
    </div>
  </div>
</template>