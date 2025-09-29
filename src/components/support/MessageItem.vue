<template>
  <div 
    class="max-w-[85%] sm:max-w-[75%] min-w-[200px] rounded-lg p-4"
    :class="[
      isSupportMessage 
        ? 'bg-gray-100 dark:bg-gray-700' 
        : 'bg-blue-100 dark:bg-blue-900',
      alignLeft ? 'rounded-tl-none' : 'rounded-tr-none'
    ]"
  >
    <!-- Message Content -->
    <div 
      class="whitespace-pre-wrap break-words"
      :class="isSupportMessage 
        ? 'text-gray-800 dark:text-gray-200' 
        : 'text-blue-800 dark:text-blue-100'"
    >
      {{ message.message }}
    </div>
    
    <!-- Message Metadata -->
    <div 
      class="mt-2 text-xs flex justify-between"
      :class="isSupportMessage 
        ? 'text-gray-600 dark:text-gray-400' 
        : 'text-blue-700 dark:text-blue-300'"
    >
      <span>{{ senderLabel }}</span>
      <span>
        {{ formatTime(message.createdAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SupportMessage } from '@/types'
import { useGlobalSession } from '@/composables/useSession'

interface Props {
  message: SupportMessage
  alignLeft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alignLeft: false
})

const { currentUser } = useGlobalSession()
const isAdminViewer = computed(() => {
  const role = currentUser.value?.role
  const userType = currentUser.value?.userType
  return role === 'admin' || userType === 'admin'
})

// Determine who sent the message using author.role when available
const isSupportMessage = computed(() => {
  if (props.message.author && props.message.author.role) {
    return props.message.author.role === 'support' || props.message.author.role === 'admin'
  }
  return props.message.isFromSupport
})

const senderLabel = computed(() => {
  if (isAdminViewer.value) {
    // For admin reader, label messages from end-user explicitly
    if (props.message.author?.role === 'user') return 'Пользователь'
    if (props.message.author?.role === 'support' || props.message.author?.role === 'admin') return 'Поддержка'
  }
  return isSupportMessage.value ? 'Поддержка' : 'Вы'
})

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>