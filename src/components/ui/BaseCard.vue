<template>
  <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/10 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div v-if="title || $slots.header" class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
      <slot name="header">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </slot>
    </div>

    <!-- Content -->
    <div class="px-4 py-5 sm:p-6">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="px-4 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sm:px-6">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

defineProps<Props>()
</script>
