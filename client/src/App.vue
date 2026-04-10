<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface HealthResponse {
  status: string
}

const health = ref<HealthResponse | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/health')
    health.value = await res.json() as HealthResponse
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to connect'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Health Check</h1>
      
      <div v-if="loading" class="text-gray-500">Loading...</div>
      
      <div v-else-if="error" class="text-red-500 p-4 bg-red-50 rounded-lg">
        Error: {{ error }}
      </div>
      
      <div v-else class="p-6 bg-green-50 rounded-lg border-2 border-green-500">
        <span class="text-green-600 font-bold text-xl">Status: {{ health?.status }}</span>
      </div>
    </div>
  </div>
</template>