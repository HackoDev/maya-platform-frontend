<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppNavigation />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from '@/components/common/AppNavigation.vue'
</script>
