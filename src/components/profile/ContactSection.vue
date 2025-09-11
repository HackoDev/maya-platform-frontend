<template>
  <div class="contact-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Контактная информация
    </h3>
    
    <div class="space-y-4">
      <!-- Telegram Contact -->
      <div 
        v-if="contacts.telegram" 
        class="flex items-center space-x-3 group relative"
        @mouseenter="showTelegramActions = true"
        @mouseleave="showTelegramActions = false"
      >
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.862-1.123 2.165-2.325 1.358l-1.714-1.268-1.138 1.09c-.13.126-.241.234-.492.234l.173-2.474 4.571-4.133c.199-.177-.043-.275-.309-.098l-5.674 3.568-2.376-.741c-.517-.162-.527-.517.108-.766l9.288-3.581c.431-.166.808.097.673.766z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Telegram</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ contacts.telegram }}</div>
        </div>
        <!-- Action Icons (shown on hover) -->
        <div 
          v-show="showTelegramActions" 
          class="flex space-x-1 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-1"
        >
          <a 
            :href="telegramUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded"
            @click="trackContact('telegram')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            @click="copyToClipboard(contacts.telegram!)"
            class="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Email Contact -->
      <div 
        v-if="contacts.email" 
        class="flex items-center space-x-3 group relative"
        @mouseenter="showEmailActions = true"
        @mouseleave="showEmailActions = false"
      >
        <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Email</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ contacts.email }}</div>
        </div>
        <!-- Action Icons (shown on hover) -->
        <div 
          v-show="showEmailActions" 
          class="flex space-x-1 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-1"
        >
          <a 
            :href="emailUrl" 
            class="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded"
            @click="trackContact('email')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            @click="copyToClipboard(contacts.email!)"
            class="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Website Contact -->
      <div 
        v-if="contacts.website" 
        class="flex items-center space-x-3 group relative"
        @mouseenter="showWebsiteActions = true"
        @mouseleave="showWebsiteActions = false"
      >
        <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Веб-сайт</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ contacts.website }}</div>
        </div>
        <!-- Action Icons (shown on hover) -->
        <div 
          v-show="showWebsiteActions" 
          class="flex space-x-1 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-1"
        >
          <a 
            :href="contacts.website" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded"
            @click="trackContact('website')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            @click="copyToClipboard(contacts.website!)"
            class="p-1 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ContactSectionProps } from '@/types/specialist-profile-view'

interface Props {
  contacts: ContactSectionProps['contacts']
  specialistName: ContactSectionProps['specialistName']
  basicInfo: ContactSectionProps['basicInfo']
}

const props = defineProps<Props>()

// Reactive state for hover actions
const showTelegramActions = ref(false)
const showEmailActions = ref(false)
const showWebsiteActions = ref(false)

// Computed URLs
const telegramUrl = computed(() => {
  if (!props.contacts.telegram) return ''
  return props.contacts.telegram.startsWith('@') 
    ? `https://t.me/${props.contacts.telegram.slice(1)}` 
    : `https://t.me/${props.contacts.telegram}`
})

const emailUrl = computed(() => {
  if (!props.contacts.email) return ''
  const subject = encodeURIComponent(`Запрос на услуги - ${props.specialistName}`)
  const body = encodeURIComponent(`Здравствуйте, ${props.specialistName}!\n\nЯ нашел ваш профиль на платформе Maya и хотел бы узнать больше о ваших услугах.\n\nС уважением`)
  return `mailto:${props.contacts.email}?subject=${subject}&body=${body}`
})

// Methods
const trackContact = (type: 'telegram' | 'email' | 'website'): void => {
  // In a real implementation, you might want to track contact clicks
  console.log(`Contact clicked: ${type}`)
}

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    // You might want to show a toast notification here
    console.log('Copied to clipboard:', text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>