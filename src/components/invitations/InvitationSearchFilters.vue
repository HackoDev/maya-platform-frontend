<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
    <div class="space-y-4">
      <!-- Search Filters Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Invitation ID Search -->
        <div>
          <label for="invitationId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID приглашения
          </label>
          <input
            id="invitationId"
            v-model="localFilters.id"
            type="text"
            placeholder="Введите invitation_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- User Type Filter -->
        <div>
          <label for="userType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Тип пользователя
          </label>
          <select
            id="userType"
            v-model="localFilters.userType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все типы</option>
            <option value="client">Клиент</option>
            <option value="specialist">Специалист</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="isActive" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Статус
          </label>
          <select
            id="isActive"
            v-model="localFilters.isActive"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="undefined">Все статусы</option>
            <option :value="true">Активные</option>
            <option :value="false">Неактивные</option>
          </select>
        </div>
      </div>

      <!-- Search Button Row -->
      <div class="flex justify-start">
        <button
          type="button"
          @click="handleSearch"
          :disabled="loading"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MagnifyingGlassIcon class="h-4 w-4 mr-1" />
          Поиск
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import type { InvitationSearchFilters } from '@/types/invitation'

interface Props {
  loading?: boolean
  initialFilters?: InvitationSearchFilters
}

interface Emits {
  (e: 'search', filters: InvitationSearchFilters): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// Local filters state
const localFilters = ref<InvitationSearchFilters>({
  limit: 10,
  offset: 0,
  userType: undefined,
  isActive: undefined,
  id: undefined,
})

// Hydrate from initialFilters when provided
watchEffect(() => {
  if (props.initialFilters) {
    localFilters.value = {
      limit: props.initialFilters.limit ?? 10,
      offset: props.initialFilters.offset ?? 0,
      userType: props.initialFilters.userType,
      isActive: props.initialFilters.isActive,
      id: props.initialFilters.id,
    }
  }
})

// Watch for changes and emit search
watch(localFilters, () => {
  // Auto-search when filters change (optional)
  // handleSearch()
}, { deep: true })

const handleSearch = () => {
  emit('search', { ...localFilters.value })
}
</script>

