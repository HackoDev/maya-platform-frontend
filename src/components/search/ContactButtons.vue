<template>
  <div class="contact-buttons flex flex-wrap gap-2">
    <!-- Telegram Contact -->
    <a
      v-if="contacts.telegram"
      :href="telegramUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'inline-flex items-center font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
      @click="trackContact('telegram')"
    >
      <svg :class="iconSizeClasses" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
      <span v-if="size !== 'xs'">Telegram</span>
    </a>

    <!-- Email Contact -->
    <a
      v-if="contacts.email"
      :href="emailUrl"
      :class="[
        'inline-flex items-center font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
      @click="trackContact('email')"
    >
      <EnvelopeIcon :class="iconSizeClasses" />
      <span v-if="size !== 'xs'">Email</span>
    </a>

    <!-- Website Contact -->
    <a
      v-if="contacts.website"
      :href="contacts.website"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'inline-flex items-center font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
      @click="trackContact('website')"
    >
      <GlobeAltIcon :class="iconSizeClasses" />
      <span v-if="size !== 'xs'">Сайт</span>
    </a>

    <!-- Save Contact Button (only show for larger sizes) -->
    <button
      v-if="showSave && size !== 'xs' && size !== 'sm'"
      type="button"
      @click="handleSaveContact"
      :class="[
        'inline-flex items-center font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
    >
      <BookmarkIcon :class="iconSizeClasses" />
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
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'header'
  showSave?: boolean
}

interface Emits {
  (e: 'contact', type: 'telegram' | 'email' | 'website', contact: string): void
  (e: 'save'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  showSave: true
})
const emit = defineEmits<Emits>()

// Computed size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'p-1.5 text-xs'
    case 'sm':
      return 'px-2 py-1.5 text-xs'
    case 'md':
      return 'px-3 py-2 text-sm'
    case 'lg':
      return 'px-4 py-2.5 text-base'
    default:
      return 'px-3 py-2 text-sm'
  }
})

const iconSizeClasses = computed(() => {
  const baseClasses = props.size === 'xs' ? '' : 'mr-2'
  switch (props.size) {
    case 'xs':
      return 'w-3 h-3'
    case 'sm':
      return `w-3 h-3 ${baseClasses}`
    case 'md':
      return `w-4 h-4 ${baseClasses}`
    case 'lg':
      return `w-5 h-5 ${baseClasses}`
    default:
      return `w-4 h-4 ${baseClasses}`
  }
})

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