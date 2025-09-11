<template>
  <div class="contacts-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 8. Как тебе можно написать?
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Способы связи
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Укажите удобные способы связи. Обязательное поле: Telegram, Email или Сайт
      </p>
    </div>

    <div class="space-y-6">
      <!-- Required Contacts -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">
          Основные способы связи <span class="text-red-500">*</span>
        </h4>
        
        <!-- Telegram -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telegram
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400">@</span>
            </div>
            <input
              :value="formState.contacts.telegram"
              @input="updateContact('telegram', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="username"
              class="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 
                'border-red-300 dark:border-red-600': contactErrors.telegram,
                'border-green-300 dark:border-green-600': formState.contacts.telegram && !contactErrors.telegram
              }"
            />
          </div>
          <div v-if="contactErrors.telegram" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ contactErrors.telegram }}
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            :value="formState.contacts.email || ''"
            @input="updateContact('email', ($event.target as HTMLInputElement).value || undefined)"
            type="email"
            placeholder="your.email@example.com"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 
              'border-red-300 dark:border-red-600': contactErrors.email,
              'border-green-300 dark:border-green-600': formState.contacts.email && !contactErrors.email
            }"
          />
          <div v-if="contactErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ contactErrors.email }}
          </div>
        </div>

        <!-- Website -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Сайт / Портфолио
          </label>
          <input
            :value="formState.contacts.website || ''"
            @input="updateContact('website', ($event.target as HTMLInputElement).value || undefined)"
            type="url"
            placeholder="https://your-website.com"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 
              'border-red-300 dark:border-red-600': contactErrors.website,
              'border-green-300 dark:border-green-600': formState.contacts.website && !contactErrors.website
            }"
          />
          <div v-if="contactErrors.website" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ contactErrors.website }}
          </div>
        </div>
      </div>

      <!-- Optional Contacts -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">
          Дополнительные способы связи
        </h4>
        
        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Телефон
          </label>
          <input
            :value="formState.contacts.phone || ''"
            @input="updateContact('phone', ($event.target as HTMLInputElement).value || undefined)"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- WhatsApp -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            WhatsApp
          </label>
          <input
            :value="formState.contacts.whatsapp || ''"
            @input="updateContact('whatsapp', ($event.target as HTMLInputElement).value || undefined)"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Discord -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Discord
          </label>
          <input
            :value="formState.contacts.discord || ''"
            @input="updateContact('discord', ($event.target as HTMLInputElement).value || undefined)"
            type="text"
            placeholder="username#1234"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- LinkedIn -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn
          </label>
          <input
            :value="formState.contacts.linkedin || ''"
            @input="updateContact('linkedin', ($event.target as HTMLInputElement).value || undefined)"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
        <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
      </div>

      <!-- Contact Summary -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          📱 Указано способов связи: {{ contactsCount }}
        </h4>
        <div v-if="hasRequiredContact" class="text-sm text-green-600 dark:text-green-400">
          ✓ Есть обязательный способ связи
        </div>
        <div v-else class="text-sm text-amber-600 dark:text-amber-400">
          ⚠️ Нужен хотя бы один основной способ связи (Telegram, Email или Сайт)
        </div>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Рекомендации по контактам:
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• <strong>Telegram</strong> — самый популярный способ связи в IT-сфере</li>
          <li>• <strong>Email</strong> — подходит для официального общения и документооборота</li>
          <li>• <strong>Сайт/Портфолио</strong> — показывает профессионализм и доверие</li>
          <li>• Чем больше способов связи, тем удобнее клиентам с вами связаться</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const validationError = ref('')
const contactErrors = ref<Record<string, string>>({})

const contactsCount = computed(() => {
  const contacts = props.formState.contacts
  return Object.values(contacts).filter(value => value && value.trim().length > 0).length
})

const hasRequiredContact = computed(() => {
  const contacts = props.formState.contacts
  return !!(contacts.telegram || contacts.email || contacts.website)
})

const updateContact = (field: string, value: any) => {
  // Clean telegram input to ensure it starts with @
  if (field === 'telegram' && value && !value.startsWith('@')) {
    value = '@' + value.replace(/^@+/, '')
  }
  
  emit('update', 'contacts', field, value)
  
  // Clear field-specific error when user starts typing
  if (contactErrors.value[field]) {
    delete contactErrors.value[field]
  }
  
  validateBlock()
}

const validateBlock = () => {
  validationError.value = ''
  contactErrors.value = {}
  
  const contacts = props.formState.contacts
  
  // Check if at least one required contact method is provided
  if (!hasRequiredContact.value) {
    validationError.value = 'Укажите хотя бы один способ связи (Telegram, Email или Сайт)'
  }
  
  // Validate telegram format
  if (contacts.telegram && !isValidTelegram(contacts.telegram)) {
    contactErrors.value.telegram = 'Telegram должен начинаться с @ и содержать только буквы, цифры и подчеркивания'
  }
  
  // Validate email format
  if (contacts.email && !isValidEmail(contacts.email)) {
    contactErrors.value.email = 'Некорректный формат email'
  }
  
  // Validate website format
  if (contacts.website && !isValidUrl(contacts.website)) {
    contactErrors.value.website = 'Некорректный формат URL (должен начинаться с http:// или https://)'
  }
  
  // Validate LinkedIn format
  if (contacts.linkedin && !isValidUrl(contacts.linkedin)) {
    contactErrors.value.linkedin = 'Некорректный формат URL'
  }
  
  emit('validate', '8')
}

// Validation functions
const isValidTelegram = (telegram: string): boolean => {
  const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/
  return telegramRegex.test(telegram)
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Watch for changes and validate
watch(() => props.formState.contacts, validateBlock, { deep: true })
</script>