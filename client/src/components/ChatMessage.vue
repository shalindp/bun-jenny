<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { Message } from '../stores/chat'

const props = defineProps<{
  message: Message
}>()

const renderedContent = computed(() => {
  if (props.message.role === 'assistant') {
    return marked(props.message.content)
  }
  return props.message.content
})
</script>

<template>
  <div 
    class="flex flex-col"
    :class="message.role === 'user' ? 'items-end' : 'items-start'"
  >
    <div 
      class="max-w-[80%] px-4 py-3 rounded-3xl"
      :style="message.role === 'user' 
        ? { background: 'var(--user-bubble)', color: 'white' } 
        : { background: 'var(--jenny-bubble)', color: 'var(--text-h)' }"
    >
      <div 
        v-if="message.role === 'assistant'" 
        class="prose prose-invert prose-pink prose-sm max-w-none"
        v-html="renderedContent"
      ></div>
      <p v-else class="whitespace-pre-wrap">{{ message.content }}</p>
    </div>
    <div 
      v-if="message.reasoning" 
      class="mt-1 text-xs italic max-w-[80%] px-2"
      style="color: var(--text); opacity: 0.5"
    >
      {{ message.reasoning }}
    </div>
  </div>
</template>