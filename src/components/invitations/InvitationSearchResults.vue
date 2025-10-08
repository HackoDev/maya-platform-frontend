<template>
  <div class="space-y-4">
    <!-- Results Header -->
    <div v-if="totalResults !== undefined" class="flex items-center justify-between">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Найдено приглашений: {{ totalResults }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && invitations.length === 0" class="flex justify-center py-12">
      <div class="flex items-center space-x-2">
        <ArrowPathIcon class="h-5 w-5 animate-spin text-blue-600" />
        <span class="text-gray-600 dark:text-gray-400">Загрузка приглашений...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div class="flex items-center space-x-3">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
        <div>
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Ошибка загрузки
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">
            {{ error }}
          </p>
        </div>
      </div>
      <div class="mt-4">
        <button
          type="button"
          @click="$emit('retry')"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900"
        >
          <ArrowPathIcon class="h-4 w-4 mr-2" />
          Попробовать снова
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="empty" class="text-center py-12">
      <UserPlusIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Нет приглашений
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Приглашения не найдены. Создайте новое приглашение для начала работы.
      </p>
      <button
        type="button"
        @click="$emit('create-invitation')"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Создать приглашение
      </button>
    </div>

    <!-- Invitations List -->
    <div v-else-if="invitations.length > 0" class="space-y-4">
      <!-- Table Header -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div>Тип пользователя</div>
          <div>Статус</div>
          <div class="text-center">Кол-во регистраций</div>
          <div>Тип ссылки</div>
          <div>Даты</div>
          <div class="text-center">Действия</div>
        </div>
      </div>
      
      <!-- Invitation Cards -->
      <InvitationCard
        v-for="invitation in invitations"
        :key="invitation.id"
        :invitation="invitation"
      />
    </div>

    <!-- Infinite Scroll Loading Spinner -->
    <div 
      v-if="loadingMore" 
      class="flex justify-center items-center py-8"
      ref="loadingIndicator"
    >
      <div class="inline-flex items-center text-gray-600 dark:text-gray-400">
        <svg
          class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-medium">Загружаем еще приглашения...</span>
      </div>
    </div>

    <!-- Infinite Scroll Trigger Element -->
    <div 
      v-if="canLoadMore && !loadingMore" 
      :ref="infiniteScroll.triggerRef" 
      class="h-4 w-full"
      aria-hidden="true"
    ></div>

    <!-- End of Results -->
    <div v-else-if="invitations.length && !canLoadMore && !loadingMore" class="text-center py-6">
      <div class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
        <CheckCircleIcon class="h-4 w-4 mr-2" />
        Показаны все результаты
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon, 
  UserPlusIcon, 
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import InvitationCard from './InvitationCard.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import type { Invitation } from '@/types/invitation'

interface Props {
  invitations: Invitation[]
  loading?: boolean
  loadingMore?: boolean
  empty?: boolean
  canLoadMore?: boolean
  totalResults?: number
  error?: string | null
}

interface Emits {
  (e: 'load-more'): void
  (e: 'retry'): void
  (e: 'create-invitation'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMore: false,
  empty: false,
  canLoadMore: false,
  totalResults: 0,
  error: null,
})

const emit = defineEmits<Emits>()

// Template refs
const loadingIndicator = ref<HTMLElement>()

// Infinite scroll setup
const infiniteScroll = useInfiniteScroll(
  () => {
    if (props.canLoadMore && !props.loadingMore && !props.loading) {
      emit('load-more')
    }
  },
  {
    rootMargin: '100px',
    threshold: 0.1,
    throttleDelay: 300,
    enabled: true,
  }
)

// Watch for changes that affect infinite scroll
watch(
  () => [props.canLoadMore, props.invitations.length],
  () => {
    infiniteScroll.reset()
  },
  { flush: 'post' }
)

// Disable/enable infinite scroll based on loading state
watch(
  () => props.loadingMore,
  (newValue) => {
    infiniteScroll.isActive.value = !newValue && props.canLoadMore
  }
)
</script>
