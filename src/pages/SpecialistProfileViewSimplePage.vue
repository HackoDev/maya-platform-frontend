<template>
  <div class="specialist-profile-view">
    <!-- Loading State -->
    <LoadingOverlay v-if="profileStore.isLoading" :loading="profileStore.isLoading" />

    <!-- Error State -->
    <div v-else-if="profileStore.error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Ошибка загрузки профиля
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ profileStore.error }}
        </p>
        <div class="space-x-4">
          <button
            @click="profileStore.retryLoading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Попробовать снова
          </button>
          <button
            @click="goBack"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Назад
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profileStore.currentProfile" class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Просмотр профиля специалиста
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Navigation -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-3">
          <button
            @click="goBack"
            class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 
                   hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Назад к поиску
          </button>
        </div>
      </div>

      <!-- Profile Header -->
      <ProfileHeader
        :basic-info="profileStore.currentProfile.basicInfo"
        :contacts="profileStore.displayContacts"
      />

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Profile Overview -->
          <div id="overview" class="mb-8">
            <ProfileOverview
              :basic-info="profileStore.currentProfile.basicInfo"
              :specializations="profileStore.displaySpecializations"
              :abilities="profileStore.displaySkills"
              :services="profileStore.displayServices"
              :public-links="profileStore.currentProfile.profileData.publicLinks || []"
            />
          </div>

          <!-- Two Column Layout for larger screens, single column for mobile -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <!-- Main Content Column -->
            <div class="xl:col-span-2 space-y-6 lg:space-y-8 order-2 xl:order-1">
              <!-- Specializations Section -->
              <div id="specializations">
                <SpecializationsSection
                  :specializations="profileStore.displaySpecializations"
                  :abilities="profileStore.displaySkills"
                />
              </div>

              <!-- Portfolio Section -->
              <div v-if="profileStore.hasPortfolio" id="portfolio">
                <PortfolioSection
                  :portfolio="profileStore.displayPortfolio"
                  :specialist-name="profileStore.currentProfile.basicInfo.displayName"
                />
              </div>

              <!-- Experience Section -->
              <div v-if="profileStore.hasExperience" id="experience">
                <ExperienceSection
                  :experience="profileStore.displayExperience"
                />
              </div>

              <!-- Services Section -->
              <div v-if="profileStore.hasServices" id="services">
                <ServicesSection
                  :services="profileStore.displayServices"
                  :specialist-name="profileStore.currentProfile.basicInfo.displayName"
                  :contacts="profileStore.displayContacts"
                />
              </div>

              <!-- Testimonials Section -->
              <div v-if="profileStore.hasTestimonials" id="testimonials">
                <TestimonialsSection
                  :testimonials="profileStore.displayTestimonials"
                />
              </div>
            </div>

            <!-- Sidebar Column -->
            <div class="xl:col-span-1 order-1 xl:order-2">
              <!-- Sticky Sidebar (only sticky in non-modal mode and on larger screens) -->
              <div class="xl:sticky xl:top-8 space-y-6">
                <!-- Admin Panel (visible only for admins) - placed first -->
                <div v-if="isAdmin" class="rounded-lg shadow-sm border p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 border-l-4 border-blue-500 dark:border-blue-400">
                  <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3 inline-flex items-center">
                    <ShieldCheckIcon class="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" />
                    Инструменты администратора
                  </h3>

                  <!-- Status Badge (compact, tag-like style) -->
                  <div class="mb-3">
                    <span class="text-xs text-gray-600 dark:text-gray-400 mr-2">Статус:</span>
                    <span
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg"
                      :class="{
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': profileStatus === 'published',
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200': profileStatus === 'draft',
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200': profileStatus === 'archived',
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300': !profileStatus
                      }"
                    >
                      {{ profileStatusText }}
                    </span>
                  </div>

                  <!-- Message to owner (compact) -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Сообщение владельцу</label>
                    <textarea
                      v-model="adminMessage"
                      rows="2"
                      class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Короткое сообщение"
                    ></textarea>
                    <div class="mt-2 flex justify-between items-center">
                      <button
                        :disabled="!adminMessage.trim() || isActing"
                        @click="openMessageOnlyConfirm"
                        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                      >
                        Отправить сообщение
                      </button>
                      <button
                        v-if="profileStatus === 'draft' || profileStatus === 'archived'"
                        @click="publishProfile"
                        :disabled="isActing"
                        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                      >
                        Опубликовать
                      </button>
                      <button
                        v-if="profileStatus === 'published'"
                        @click="unpublishProfile"
                        :disabled="isActing"
                        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                      >
                        Снять с публикации
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Quick Contact -->
                <div id="contacts">
                  <ContactSection
                    :contacts="profileStore.displayContacts"
                    :specialist-name="profileStore.currentProfile.basicInfo.displayName"
                    :basic-info="profileStore.currentProfile.basicInfo"
                  />
                </div>

                <!-- Share Profile -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Поделиться профилем
                  </h3>
                  <div class="space-y-3">
                    <button
                      @click="profileStore.shareProfile"
                      class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium 
                             text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 
                             dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Поделиться
                    </button>
                    <button
                      @click="profileStore.copyProfileLink"
                      class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium 
                             text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 
                             dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Скопировать ссылку
                    </button>
                  </div>
                </div>

                <!-- Confirm Dialog -->
                <ConfirmDialog
                  :is-open="showConfirmModal"
                  :title="confirmConfig.title"
                  :message="confirmConfig.message"
                  :confirm-text="confirmConfig.confirmText"
                  :cancel-text="confirmConfig.cancelText"
                  :confirm-button-type="confirmConfig.confirmButtonType"
                  @confirm="handleConfirm"
                  @cancel="handleCancel"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-gray-400 text-6xl mb-4">👤</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Профиль не найден
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Специалист с таким ID не существует или профиль был удален
        </p>
        <button
          @click="goBack"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Назад к поиску
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpecialistProfileViewStore } from '@/stores/specialist-profile-view-simple'
import { useUserStore } from '@/stores/user'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { portfoliosApi } from '@/services/portfoliosApiClient'
// Components
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileOverview from '@/components/profile/ProfileOverview.vue'
import SpecializationsSection from '@/components/profile/SpecializationsSection.vue'
import PortfolioSection from '@/components/profile/PortfolioSection.vue'
import ExperienceSection from '@/components/profile/ExperienceSection.vue'
import ServicesSection from '@/components/profile/ServicesSection.vue'
import TestimonialsSection from '@/components/profile/TestimonialsSection.vue'
import ContactSection from '@/components/profile/ContactSection.vue'

interface Props {
  specialistId?: string
  modalMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modalMode: false
})

// Composables
const route = useRoute()
const router = useRouter()
const profileStore = useSpecialistProfileViewStore()
const userStore = useUserStore()

const specialistId = computed(() => props.specialistId || (route.params.id as string))

// Admin visibility and status helpers
const isAdmin = computed(() => {
  const user = userStore.currentUser
  return (user?.userType === 'admin') || (user?.role === 'admin')
})

const profileStatus = computed(() => profileStore.currentProfile?.profileData.status || null)
const profileStatusText = computed(() => {
  const status = profileStatus.value
  if (status === 'published') return 'Опубликована'
  if (status === 'draft') return 'Черновик'
  if (status === 'archived') return 'Архивирована'
  return 'Не создана'
})

// Admin actions
const adminMessage = ref('')
const isActing = ref(false)
const showConfirmModal = ref(false)
const confirmConfig = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Отмена',
  confirmButtonType: 'primary' as 'primary' | 'danger',
  nextStatus: 'published' as 'published' | 'draft' | 'archived'
})

const publishProfile = () => {
  if (isActing.value) return
  confirmConfig.value = {
    title: 'Подтверждение публикации',
    message: 'Опубликовать анкету? Сообщение (если указано) будет отправлено владельцу.',
    confirmText: 'Опубликовать',
    cancelText: 'Отмена',
    confirmButtonType: 'primary',
    nextStatus: 'published'
  }
  showConfirmModal.value = true
}

const unpublishProfile = () => {
  if (isActing.value) return
  confirmConfig.value = {
    title: 'Подтверждение снятия с публикации',
    message: 'Сохранить анкету как Черновик и отправить сообщение (опционально)?',
    confirmText: 'Отправить и снять',
    cancelText: 'Отмена',
    confirmButtonType: 'danger',
    nextStatus: 'draft'
  }
  showConfirmModal.value = true
}

const handleConfirm = async () => {
  const id = profileStore.currentProfile?.basicInfo.id
  if (!id) return
  try {
    isActing.value = true
    await portfoliosApi.reviewPortfolio(id, { status: confirmConfig.value.nextStatus, message: adminMessage.value })
    if (confirmConfig.value.nextStatus) {
      await profileStore.loadProfile(id)
    }
    adminMessage.value = ''
    showConfirmModal.value = false
  } catch (e) {
    console.error(e)
    alert('Действие не удалось')
  } finally {
    isActing.value = false
  }
}

const handleCancel = () => {
  showConfirmModal.value = false
}

const openMessageOnlyConfirm = () => {
  if (!adminMessage.value.trim() || isActing.value) return
  confirmConfig.value = {
    title: 'Отправить сообщение владельцу',
    message: 'Отправить сообщение без изменения статуса?',
    confirmText: 'Отправить',
    cancelText: 'Отмена',
    confirmButtonType: 'primary',
    nextStatus: null as any
  }
  showConfirmModal.value = true
}

// Kept for future integration if we split message sending from status action
// const sendAdminMessage = async () => {
//   if (!adminMessage.value.trim()) return
//   console.log('Admin message sent:', adminMessage.value)
//   adminMessage.value = ''
// }

const goBack = () => {
  if (props.modalMode) {
    // Emit close event for modal mode
    // emit('close')
  } else {
    router.back()
  }
}

onMounted(async () => {
  if (specialistId.value) {
    await profileStore.loadProfile(specialistId.value)
  }
})

onUnmounted(() => {
  profileStore.clearProfile()
})
</script>

<style scoped>
/* Smooth scrolling for internal navigation */
html {
  scroll-behavior: smooth;
}

/* Container max-width adjustments */
.container {
  max-width: 1200px;
}

/* Sticky sidebar positioning */
.sticky {
  position: sticky;
  top: 2rem;
}

/* Loading overlay positioning */
.specialist-profile-view {
  position: relative;
  min-height: 100vh;
}

/* Enhanced transitions */
.profile-section {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sticky {
    position: static;
  }
  
  .lg\:col-span-2,
  .lg\:col-span-1 {
    grid-column: span 1;
  }
}

/* Print styles */
@media print {
  .back-navigation,
  .share-profile,
  .quick-actions {
    display: none;
  }
  
  .specialist-profile-view {
    background: white;
  }
  
  .bg-gradient-to-r {
    background: #4F46E5 !important;
    color: white !important;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .specialist-profile-view {
    background-color: #111827;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-colors,
  .transition-transform {
    transition: none;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* Focus states for keyboard navigation */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gray-50 {
    background-color: white;
  }
  
  .bg-gray-900 {
    background-color: black;
  }
  
  .border-gray-200,
  .border-gray-700 {
    border-color: currentColor;
  }
}
</style>
