<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useServerStore } from '../stores/server'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'

const server = useServerStore()
const { isHealthy, checking } = storeToRefs(server)

onMounted(() => server.startPolling())
onUnmounted(() => server.stopPolling())
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-3">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <RouterLink to="/chat" class="text-xl font-bold text-gray-800">Jenny</RouterLink>
        <div class="flex gap-4">
          <RouterLink 
            to="/chat" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-blue-600 font-medium"
          >
            Chat
          </RouterLink>
          <RouterLink 
            to="/profile" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-blue-600 font-medium"
          >
            Profile
          </RouterLink>
          <RouterLink 
            to="/settings" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-blue-600 font-medium"
          >
            Settings
          </RouterLink>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">{{ checking ? 'Checking...' : isHealthy ? 'Online' : 'Offline' }}</span>
        <span 
          class="w-2.5 h-2.5 rounded-full"
          :class="isHealthy ? 'bg-green-500' : 'bg-red-500'"
        ></span>
      </div>
    </div>
  </nav>
</template>