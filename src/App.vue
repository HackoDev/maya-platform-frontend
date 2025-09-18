<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <TopNavbar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavbar from '@/components/common/TopNavbar.vue'


</script>
