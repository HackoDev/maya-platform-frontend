<template>
  <div class="specialist-profile-view">
    <!-- Loading State -->
    <LoadingOverlay v-if="profileStore.isLoading" />

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
            @click="retryLoading"
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
    <div v-else-if="profileStore.currentProfile" :class="modalMode ? 'bg-gray-50 dark:bg-gray-900' : 'min-h-screen bg-gray-50 dark:bg-gray-900'">
      <!-- Back Navigation (only show for non-modal mode) -->
      <div v-if="!modalMode" class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
        :contacts="profileStore.currentProfile.detailedInfo.contacts"
      />

      <!-- Main Content -->
      <div :class="modalMode ? 'px-4 py-6' : 'container mx-auto px-4 py-8'">
        <div :class="modalMode ? 'max-w-none' : 'max-w-7xl mx-auto'">
          <!-- Profile Overview -->
          <div id="overview" class="mb-8">
            <ProfileOverview
              :basic-info="profileStore.currentProfile.basicInfo"
              :specializations="profileStore.currentProfile.detailedInfo.specializations"
              :abilities="profileStore.currentProfile.detailedInfo.abilities"
              :services="profileStore.currentProfile.detailedInfo.services"
            />
          </div>

          <!-- Two Column Layout for larger screens, single column for mobile -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <!-- Main Content Column -->
            <div class="xl:col-span-2 space-y-6 lg:space-y-8 order-2 xl:order-1">
              <!-- Specializations Section -->
              <div id="specializations">
                <SpecializationsSection
                  :specializations="profileStore.currentProfile.detailedInfo.specializations"
                  :abilities="profileStore.currentProfile.detailedInfo.abilities"
                />
              </div>

              <!-- Services Section -->
              <div id="services">
                <ServicesSection
                  :services="profileStore.currentProfile.detailedInfo.services"
                  :specialist-name="profileStore.currentProfile.basicInfo.displayName"
                  :contacts="profileStore.currentProfile.detailedInfo.contacts"
                />
              </div>

              <!-- Portfolio Section -->
              <div v-if="profileStore.hasPortfolio" id="portfolio">
                <PortfolioSection
                  :portfolio="profileStore.currentProfile.detailedInfo.portfolio"
                  :specialist-name="profileStore.currentProfile.basicInfo.displayName"
                />
              </div>

              <!-- Experience Section -->
              <div v-if="profileStore.hasExperience" id="experience">
                <ExperienceSection
                  :experience="profileStore.currentProfile.detailedInfo.experience"
                />
              </div>

              <!-- Testimonials Section -->
              <div v-if="profileStore.hasTestimonials" id="testimonials">
                <TestimonialsSection
                  :testimonials="profileStore.currentProfile.detailedInfo.testimonials"
                />
              </div>
            </div>

            <!-- Sidebar Column -->
            <div class="xl:col-span-1 order-1 xl:order-2">
              <!-- Sticky Sidebar (only sticky in non-modal mode and on larger screens) -->
              <div :class="modalMode ? 'space-y-6' : 'xl:sticky xl:top-8 space-y-6'">
                <!-- Quick Contact -->
                <div id="contacts">
                  <ContactSection
                    :contacts="profileStore.currentProfile.detailedInfo.contacts"
                    :specialist-name="profileStore.currentProfile.basicInfo.displayName"
                    :basic-info="profileStore.currentProfile.basicInfo"
                  />
                </div>

                <!-- Profile Stats -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Статистика профиля
                  </h3>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Завершенность</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ profileStore.profileCompletionPercentage }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="`width: ${profileStore.profileCompletionPercentage}%`"
                      ></div>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Последнее обновление: {{ formatDate(profileStore.currentProfile.metadata.lastUpdated) }}
                    </div>
                  </div>
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
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpecialistProfileViewStore } from '@/stores/specialist-profile-view'
import type { SpecialistProfileViewPageProps } from '@/types/specialist-profile-view'

// Components
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileOverview from '@/components/profile/ProfileOverview.vue'
import SpecializationsSection from '@/components/profile/SpecializationsSection.vue'
import ServicesSection from '@/components/profile/ServicesSection.vue'
import PortfolioSection from '@/components/profile/PortfolioSection.vue'
import ExperienceSection from '@/components/profile/ExperienceSection.vue'
import TestimonialsSection from '@/components/profile/TestimonialsSection.vue'
import ContactSection from '@/components/profile/ContactSection.vue'

interface Props {
  specialistId: string
  modalMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modalMode: false
})

// Composables
const route = useRoute()
const router = useRouter()
const profileStore = useSpecialistProfileViewStore()

// Computed
const specialistId = computed(() => {
  return props.specialistId || (route.params.id as string)
})

// Methods
const retryLoading = async (): Promise<void> => {
  await profileStore.loadProfile(specialistId.value)
}

const goBack = (): void => {
  if (props.modalMode) {
    profileStore.closeModal()
  } else {
    // Check if we came from search page
    const from = route.query.from as string
    if (from === 'search') {
      router.push('/search/specialists')
    } else {
      router.go(-1)
    }
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  if (specialistId.value) {
    await profileStore.loadProfile(specialistId.value)
  }
})

onUnmounted(() => {
  // Clean up when component is unmounted
  if (!props.modalMode) {
    profileStore.clearProfile()
  }
})

// Handle modal mode
if (props.modalMode) {
  onMounted(() => {
    profileStore.openModal()
  })
  
  onUnmounted(() => {
    profileStore.closeModal()
  })
}
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