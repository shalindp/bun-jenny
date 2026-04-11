<script setup lang="ts">
import { onMounted } from 'vue'
import { useServerStore } from '../stores/server'
import { useChatStore } from '../stores/chat'
import ChatWindow from '../components/ChatWindow.vue'

const server = useServerStore()
const chat = useChatStore()

onMounted(async () => {
  if (!server.isInitialized && !server.initializing) {
    await server.initialize()
    if (server.initResponse) {
      chat.addInitMessage(server.initResponse.response, server.initResponse.reasoning)
    }
  }
})
</script>

<template>
  <div class="h-[calc(100vh-57px)]">
    <ChatWindow :disabled="!server.isInitialized || server.initializing" />
  </div>
</template>