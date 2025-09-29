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
        :class="isAlignedLeft(message) ? 'justify-start' : 'justify-end'"
      >
        <MessageItem :message="message" :align-left="isAlignedLeft(message)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SupportMessage } from '@/types'
import MessageItem from '@/components/support/MessageItem.vue'
import { useGlobalSession } from '@/composables/useSession'

interface Props {
  messages: SupportMessage[]
}

defineProps<Props>()

// Determine viewer role from session (support both role and userType for admin)
const { currentUser } = useGlobalSession()
const isAdminViewer = computed(() => {
  const role = currentUser.value?.role
  const userType = currentUser.value?.userType
  return role === 'admin' || userType === 'admin'
})

// Alignment logic:
// - For admin viewer: messages from author.role === 'user' align left, others right
// - For client/specialist viewer: keep existing behavior (support on left, you on right)
const isAlignedLeft = (message: SupportMessage): boolean => {
  if (isAdminViewer.value) {
    return message.author?.role === 'user'
  }
  // Prefer author.role when present; fallback to isFromSupport
  if (message.author && message.author.role) {
    return message.author.role === 'support' || message.author.role === 'admin'
  }
  return message.isFromSupport
}
</script>