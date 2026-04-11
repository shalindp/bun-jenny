<template>
  <div class="flex items-center gap-2">
    <div 
      class="w-3 h-3 rounded-full"
      :class="statusClass"
    />
    <span class="text-sm" :class="textClass">
      {{ statusText }}
    </span>
    <button 
      v-if="!isHealthy && !loading"
      @click="checkHealth"
      class="text-xs text-pink hover:text-pink-light transition-colors"
    >
      Retry
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServerStore } from '../stores/server'

const server = useServerStore()

const loading = ref(true)

const statusClass = computed(() => {
  if (loading.value) return 'bg-warning animate-pulse'
  return server.isHealthy ? 'bg-success' : 'bg-error'
})

const textClass = computed(() => {
  if (loading.value) return 'text-warning'
  return server.isHealthy ? 'text-success' : 'text-error'
})

const statusText = computed(() => {
  if (loading.value) return 'Checking...'
  return server.isHealthy ? 'Server Online' : 'Server Offline'
})

const isHealthy = computed(() => server.isHealthy)

const checkHealth = async () => {
  loading.value = true
  await server.checkHealth()
  loading.value = false
}

onMounted(() => {
  checkHealth()
})

setInterval(checkHealth, 30000)
</script>