<template>
  <header class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/10">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
          <p v-if="description" class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex items-center space-x-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>
