<template>
  <ProfileViewModal
    :is-open="isOpen"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="full"
    backdrop="blur"
    :show-share="true"
    @close="handleClose"
    @share="handleShare"
  >
    <SpecialistProfileViewPage
      v-if="specialistId"
      :specialist-id="specialistId"
      :modal-mode="true"
    />
    
    <!-- Loading State for Modal -->
    <div v-else-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 dark:text-gray-400">Загрузка профиля...</p>
      </div>
    </div>
    
    <!-- Error State for Modal -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center max-w-md">
        <div class="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ошибка загрузки
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ error }}
        </p>
        <div class="space-x-3">
          <button
            @click="handleRetry"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
          <button
            @click="handleClose"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </ProfileViewModal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSpecialistProfileViewStore } from '@/stores/specialist-profile-view'
import ProfileViewModal from '@/components/ui/ProfileViewModal.vue'
import SpecialistProfileViewPage from '@/pages/SpecialistProfileViewPage.vue'

interface Props {
  specialistId?: string
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'share'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Store
const profileStore = useSpecialistProfileViewStore()

// Computed properties
const modalTitle = computed(() => {
  if (profileStore.currentProfile) {
    return `Профиль: ${profileStore.currentProfile.basicInfo.displayName}`
  }
  return 'Профиль специалиста'
})

const modalSubtitle = computed(() => {
  if (profileStore.currentProfile) {
    return profileStore.currentProfile.basicInfo.superpower
  }
  return ''
})

const isLoading = computed(() => profileStore.isLoading)
const error = computed(() => profileStore.error)

// Event handlers
const handleClose = (): void => {
  profileStore.closeModal()
  emit('close')
}

const handleShare = (): void => {
  profileStore.shareProfile()
  emit('share')
}

const handleRetry = async (): Promise<void> => {
  if (props.specialistId) {
    await profileStore.loadProfile(props.specialistId)
  }
}

// Watch for specialistId changes and load profile
watch(
  () => props.specialistId,
  async (newId) => {
    if (newId && props.isOpen) {
      await profileStore.loadProfile(newId)
    }
  },
  { immediate: true }
)

// Watch for modal open state
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      profileStore.openModal()
      if (props.specialistId && !profileStore.currentProfile) {
        await profileStore.loadProfile(props.specialistId)
      }
    } else {
      profileStore.closeModal()
    }
  }
)
</script>

<style scoped>
/* Additional modal-specific styles */
.specialist-profile-modal {
  /* Ensure proper modal behavior */
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>