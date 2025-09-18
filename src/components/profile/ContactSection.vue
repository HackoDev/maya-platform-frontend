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
      
      
      
      <!-- Phone Contact -->
      <div 
        v-if="contacts.phone" 
        class="flex items-center space-x-3 group relative"
        @mouseenter="showPhoneActions = true"
        @mouseleave="showPhoneActions = false"
      >
        <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Телефон</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ contacts.phone }}</div>
        </div>
        <!-- Action Icons (shown on hover) -->
        <div 
          v-show="showPhoneActions" 
          class="flex space-x-1 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-1"
        >
          <a 
            :href="phoneUrl" 
            class="p-1 text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 rounded"
            @click="trackContact('phone')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
          <button 
            @click="copyToClipboard(contacts.phone!)"
            class="p-1 text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- WhatsApp Contact -->
      <div 
        v-if="contacts.whatsapp" 
        class="flex items-center space-x-3 group relative"
        @mouseenter="showWhatsAppActions = true"
        @mouseleave="showWhatsAppActions = false"
      >
        <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ contacts.whatsapp }}</div>
        </div>
        <!-- Action Icons (shown on hover) -->
        <div 
          v-show="showWhatsAppActions" 
          class="flex space-x-1 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-1"
        >
          <a 
            :href="whatsappUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded"
            @click="trackContact('whatsapp')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            @click="copyToClipboard(contacts.whatsapp!)"
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
const showPhoneActions = ref(false)
const showWhatsAppActions = ref(false)
const showTelegramActions = ref(false)

// Computed URLs
const phoneUrl = computed(() => {
  if (!props.contacts.phone) return ''
  return `tel:${props.contacts.phone}`
})

const whatsappUrl = computed(() => {
  if (!props.contacts.whatsapp) return ''
  const cleanPhone = props.contacts.whatsapp.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Здравствуйте! Интересуют ваши услуги. Увидел ваш профиль на Maya Platform.`
  )
  return `https://wa.me/${cleanPhone}?text=${message}`
})

const telegramUrl = computed(() => {
  if (!props.contacts.telegram) return ''
  return props.contacts.telegram.startsWith('@') 
    ? `https://t.me/${props.contacts.telegram.slice(1)}` 
    : `https://t.me/${props.contacts.telegram}`
})


// Methods
const trackContact = (type: 'phone' | 'whatsapp' | 'telegram'): void => {
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