<template>
  <div class="contact-buttons flex flex-wrap gap-2">
    <!-- Phone Contact -->
    <a
      v-if="contacts.phone"
      :href="phoneUrl"
      :class="[
        'inline-flex items-center font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
      @click="trackContact('phone')"
    >
      <svg :class="iconSizeClasses" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
      <span v-if="size !== 'xs'">Телефон</span>
    </a>

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

    <!-- WhatsApp Contact -->
    <a
      v-if="contacts.whatsapp"
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'inline-flex items-center font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
      @click="trackContact('whatsapp')"
    >
      <svg :class="iconSizeClasses" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
      </svg>
      <span v-if="size !== 'xs'">WhatsApp</span>
    </a>

    <!-- Instagram Contact -->
    <a
      v-if="contacts.instagram"
      :href="instagramUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'inline-flex items-center font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses
      ]"
      @click="trackContact('instagram')"
    >
      <svg :class="iconSizeClasses" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      <span v-if="size !== 'xs'">Instagram</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  contacts: {
    phone?: string
    telegram?: string
    whatsapp?: string
    instagram?: string
  }
  specialistName: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'header'
}

interface Emits {
  (e: 'contact', type: 'phone' | 'telegram' | 'whatsapp' | 'instagram', contact: string): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default'
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
const phoneUrl = computed(() => {
  if (!props.contacts.phone) return ''
  return `tel:${props.contacts.phone}`
})

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

const whatsappUrl = computed(() => {
  if (!props.contacts.whatsapp) return ''
  const cleanPhone = props.contacts.whatsapp.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Здравствуйте! Интересуют ваши услуги. Увидел ваш профиль на Maya Platform.`
  )
  return `https://wa.me/${cleanPhone}?text=${message}`
})

const instagramUrl = computed(() => {
  if (!props.contacts.instagram) return ''
  
  // Handle different instagram formats
  const instagram = props.contacts.instagram
  if (instagram.startsWith('http')) {
    return instagram
  }
  
  // Remove @ if present and create URL
  const username = instagram.replace('@', '')
  return `https://instagram.com/${username}`
})

// Methods
const trackContact = (type: 'phone' | 'telegram' | 'whatsapp' | 'instagram'): void => {
  const contact = props.contacts[type]
  if (contact) {
    emit('contact', type, contact)
  }
}
</script>

<style scoped>
.contact-buttons {
  /* Ensure proper spacing on mobile */
  min-width: 0;
}

/* Brand colors */
.contact-buttons a[href*="t.me"] {
  background-color: #0088cc;
}

.contact-buttons a[href*="t.me"]:hover {
  background-color: #006699;
}

.contact-buttons a[href*="wa.me"] {
  background-color: #25D366;
}

.contact-buttons a[href*="wa.me"]:hover {
  background-color: #128C7E;
}

.contact-buttons a[href*="instagram.com"] {
  background-color: #E4405F;
}

.contact-buttons a[href*="instagram.com"]:hover {
  background-color: #C13584;
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