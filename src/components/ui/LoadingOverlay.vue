<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto" />
      <p class="mt-4 text-lg text-gray-600">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
})
</script>
