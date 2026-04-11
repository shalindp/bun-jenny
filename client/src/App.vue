<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden" style="background: var(--bg)">
    <NavBar />
    <RouterView />
  </div>
</template>