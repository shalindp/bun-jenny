<template>
  <div class="flex-1 overflow-y-auto px-6 py-8">
    <div class="max-w-xl mx-auto">
      <!-- Profile Header -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">👋</div>
        <h1 class="text-2xl font-bold text-white mb-1">Hello, {{ profile.profile.name }}</h1>
        <p class="text-text-muted">Keep up the great work!</p>
      </div>
      
      <!-- IELTS Band -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold mb-4">IELTS Band</h2>
        <div class="flex items-center justify-center mb-4">
          <div class="text-6xl font-bold text-pink">{{ profile.profile.ieltsBand }}</div>
          <div class="ml-4 text-left">
            <div class="text-lg font-semibold text-white">Limited User</div>
            <div class="text-sm text-text-muted">Basic competence in familiar situations</div>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold mb-4">Your Progress</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 bg-bg-secondary rounded-lg">
            <div class="text-2xl font-bold text-white">--</div>
            <div class="text-sm text-text-muted">Sessions</div>
          </div>
          <div class="text-center p-3 bg-bg-secondary rounded-lg">
            <div class="text-2xl font-bold text-white">--</div>
            <div class="text-sm text-text-muted">Messages</div>
          </div>
          <div class="text-center p-3 bg-bg-secondary rounded-lg">
            <div class="text-2xl font-bold text-white">--</div>
            <div class="text-sm text-text-muted">Day Streak</div>
          </div>
          <div class="text-center p-3 bg-bg-secondary rounded-lg">
            <div class="text-2xl font-bold text-white">--</div>
            <div class="text-sm text-text-muted">Best Streak</div>
          </div>
        </div>
      </div>
      
      <!-- Badges -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Badges</h2>
        <div class="text-center py-4 text-text-muted">
          Complete sessions and practice to earn badges!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '../stores/profile'

const profile = useProfileStore()
</script>