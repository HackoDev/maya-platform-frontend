<template>
  <div 
    class="max-w-[85%] sm:max-w-[75%] rounded-lg p-4"
    :class="message.isFromSupport 
      ? 'bg-gray-100 dark:bg-gray-700 rounded-tl-none' 
      : 'bg-blue-100 dark:bg-blue-900 rounded-tr-none'"
  >
    <!-- Message Content -->
    <div 
      class="whitespace-pre-wrap break-words"
      :class="message.isFromSupport 
        ? 'text-gray-800 dark:text-gray-200' 
        : 'text-blue-800 dark:text-blue-100'"
    >
      {{ message.message }}
    </div>
    
    <!-- Message Metadata -->
    <div 
      class="mt-2 text-xs flex justify-between"
      :class="message.isFromSupport 
        ? 'text-gray-600 dark:text-gray-400' 
        : 'text-blue-700 dark:text-blue-300'"
    >
      <span>
        {{ message.isFromSupport ? 'Поддержка' : 'Вы' }}
      </span>
      <span>
        {{ formatTime(message.createdAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupportMessage } from '@/types'

interface Props {
  message: SupportMessage
}

const props = defineProps<Props>()

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>