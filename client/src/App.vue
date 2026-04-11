<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="h-screen overflow-hidden" style="background: var(--bg)">
    <NavBar />
    <RouterView />
  </div>
</template>