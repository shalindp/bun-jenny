<template>
  <nav class="flex items-center justify-between p-3 border-b border-border bg-bg-primary/80 backdrop-blur-sm sticky top-0 z-50">
    <!-- Left: Navigation Links -->
    <div class="flex items-center gap-1 bg-bg-secondary/30 p-1 rounded-2xl">
      <router-link 
        v-for="link in navLinks" 
        :key="link.path"
        :to="link.path" 
        class="nav-link relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500"
        :class="{ 'nav-link-active': $route.path === link.path }"
      >
        <!-- Glowing background -->
        <span 
          class="absolute inset-0 rounded-xl transition-all duration-500"
          :class="$route.path === link.path ? 'opacity-100' : 'opacity-0'"
        >
          <span class="absolute inset-0 bg-gradient-to-r from-pink via-pink-light to-pink rounded-xl animate-gradient"></span>
        </span>
        
        <!-- Glow effect -->
        <span 
          v-if="$route.path === link.path"
          class="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(255,105,180,0.5)] animate-pulse"
        ></span>
        
        <span 
          class="relative z-10 transition-all duration-300"
          :class="$route.path === link.path ? 'text-white drop-shadow-md' : 'text-text-muted group-hover:text-white'"
        >
          {{ link.label }}
        </span>
      </router-link>
    </div>
    
    <!-- Right: Profile Avatar + IELTS + Connection Status -->
    <div class="flex items-center gap-3">
      <!-- Profile Avatar with IELTS Band -->
      <div 
        class="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary/30 rounded-full cursor-pointer border border-transparent hover:border-pink/30 transition-all duration-300 group"
        :class="{ 'ring-2 ring-pink/50 shadow-[0_0_15px_rgba(255,105,180,0.3)]': $route.path === '/profile' }"
        @click="$router.push('/profile')"
      >
        <div class="relative">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink via-pink-light to-pink-dark flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300 animate-shimmer">
            {{ profile.profile.name?.[0] || 'K' }}
          </div>
          <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-bg-primary shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
        </div>
        <div class="text-left">
          <div class="text-xs text-text-muted">{{ profile.profile.name }}</div>
          <div class="text-sm font-bold text-pink group-hover:text-pink-light transition-colors">Band {{ profile.profile.ieltsBand }}</div>
        </div>
      </div>
      
      <!-- Connection Status -->
      <div class="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary/30 rounded-full">
        <div 
          class="w-2.5 h-2.5 rounded-full transition-all duration-300"
          :class="server.isHealthy ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.8)]'"
        />
        <span class="text-xs font-medium text-text-muted">
          {{ server.isHealthy ? 'Online' : 'Offline' }}
        </span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useServerStore } from '../stores/server'
import { useProfileStore } from '../stores/profile'
import { onMounted, onUnmounted } from 'vue'

const server = useServerStore()
const profile = useProfileStore()

onMounted(() => server.startPolling())
onUnmounted(() => server.stopPolling())

const navLinks = [
  { path: '/chat', label: 'Session' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/settings', label: 'Settings' }
]
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

.animate-shimmer {
  background: linear-gradient(90deg, #FF69B4 0%, #FF85C1 50%, #FF69B4 100%);
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

.nav-link {
  @apply text-text-muted;
}

.nav-link:hover:not(.nav-link-active) {
  @apply text-white;
}
</style>