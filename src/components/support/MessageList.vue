<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      История сообщений
    </h2>
    
    <div class="space-y-4">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="flex"
        :class="message.isFromSupport ? 'justify-start' : 'justify-end'"
      >
        <MessageItem :message="message" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupportMessage } from '@/types'
import MessageItem from '@/components/support/MessageItem.vue'

interface Props {
  messages: SupportMessage[]
}

defineProps<Props>()
</script>