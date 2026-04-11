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
  <nav class="px-4 py-3" style="background: var(--surface); border-bottom: 1px solid var(--border)">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <RouterLink to="/chat" class="text-xl font-semibold" style="color: var(--accent)">Jenny</RouterLink>
        <div class="flex gap-4">
          <RouterLink 
            to="/chat" 
            class="text-white/70 hover:text-white transition-colors"
            active-class="font-medium"
            :style="{ color: 'var(--accent)' }"
          >
            Chat
          </RouterLink>
          <RouterLink 
            to="/profile" 
            class="text-white/70 hover:text-white transition-colors"
            active-class="font-medium"
            :style="{ color: 'var(--accent)' }"
          >
            Profile
          </RouterLink>
          <RouterLink 
            to="/settings" 
            class="text-white/70 hover:text-white transition-colors"
            active-class="font-medium"
            :style="{ color: 'var(--accent)' }"
          >
            Settings
          </RouterLink>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm" style="color: var(--text)">{{ checking ? 'Checking...' : isHealthy ? 'Online' : 'Offline' }}</span>
        <span 
          class="w-2.5 h-2.5 rounded-full"
          :style="{ backgroundColor: isHealthy ? '#4ade80' : '#f87171', boxShadow: isHealthy ? '0 0 8px #4ade80' : 'none' }"
        ></span>
      </div>
    </div>
  </nav>
</template>