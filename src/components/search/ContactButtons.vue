<template>
  <div class="contact-buttons flex flex-wrap gap-2">
    <!-- Telegram Contact -->
    <a
      v-if="contacts.telegram"
      :href="telegramUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
             bg-blue-500 hover:bg-blue-600 rounded-md transition-colors 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
             dark:focus:ring-offset-gray-800"
      @click="trackContact('telegram')"
    >
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
      Telegram
    </a>

    <!-- Email Contact -->
    <a
      v-if="contacts.email"
      :href="emailUrl"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
             bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
             border border-gray-300 dark:border-gray-600 rounded-md transition-colors 
             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
             dark:focus:ring-offset-gray-800"
      @click="trackContact('email')"
    >
      <EnvelopeIcon class="w-4 h-4 mr-2" />
      Email
    </a>

    <!-- Website Contact -->
    <a
      v-if="contacts.website"
      :href="contacts.website"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
             bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
             border border-gray-300 dark:border-gray-600 rounded-md transition-colors 
             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
             dark:focus:ring-offset-gray-800"
      @click="trackContact('website')"
    >
      <GlobeAltIcon class="w-4 h-4 mr-2" />
      Сайт
    </a>

    <!-- Save Contact Button -->
    <button
      type="button"
      @click="handleSaveContact"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
             bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
             border border-gray-300 dark:border-gray-600 rounded-md transition-colors 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
             dark:focus:ring-offset-gray-800"
    >
      <BookmarkIcon class="w-4 h-4 mr-2" />
      Сохранить
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EnvelopeIcon, GlobeAltIcon, BookmarkIcon } from '@heroicons/vue/24/outline'
import type { ContactButtonsProps } from '@/types/specialist-search'

interface Props {
  contacts: {
    telegram?: string
    email?: string
    website?: string
  }
  specialistName: string
}

interface Emits {
  (e: 'contact', type: 'telegram' | 'email' | 'website', contact: string): void
  (e: 'save'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed URLs
const telegramUrl = computed(() => {
  if (!props.contacts.telegram) return ''
  
  // Handle different telegram formats
  const telegram = props.contacts.telegram
  if (telegram.startsWith('http')) {
    return telegram
  }
  
  // Remove @ if present and create URL
  const username = telegram.replace('@', '')
  return `https://t.me/${username}`
})

const emailUrl = computed(() => {
  if (!props.contacts.email) return ''
  
  const subject = encodeURIComponent(`Запрос на услуги - ${props.specialistName}`)
  const body = encodeURIComponent(`Здравствуйте, ${props.specialistName}!\n\nЯ нашел ваш профиль на платформе Maya и хотел бы узнать больше о ваших услугах.\n\nС уважением`)
  
  return `mailto:${props.contacts.email}?subject=${subject}&body=${body}`
})

// Methods
const trackContact = (type: 'telegram' | 'email' | 'website'): void => {
  const contact = props.contacts[type]
  if (contact) {
    emit('contact', type, contact)
  }
}

const handleSaveContact = (): void => {
  emit('save')
}
</script>

<style scoped>
.contact-buttons {
  /* Ensure proper spacing on mobile */
  min-width: 0;
}

/* Telegram brand color */
.contact-buttons a[href*="t.me"] {
  background-color: #0088cc;
}

.contact-buttons a[href*="t.me"]:hover {
  background-color: #006699;
}

/* Button hover effects */
.contact-buttons a,
.contact-buttons button {
  transform: translateY(0);
  transition: all 0.15s ease-in-out;
}

.contact-buttons a:hover,
.contact-buttons button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dark .contact-buttons a:hover,
.dark .contact-buttons button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Focus ring adjustments */
.contact-buttons a:focus,
.contact-buttons button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .contact-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .contact-buttons a,
  .contact-buttons button {
    justify-content: center;
    width: 100%;
  }
}
</style>