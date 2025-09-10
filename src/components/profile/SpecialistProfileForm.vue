<template>
  <div class="specialist-profile-form">
    <!-- Questionnaire Type Selection -->
    <div
      v-if="!selectedQuestionnaireType"
      class="questionnaire-selector bg-white p-6 rounded-lg border border-gray-200 mb-6"
    >
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Выберите тип анкеты специалиста</h1>
      <p class="text-gray-600 mb-6">
        Выберите подходящий формат анкеты в зависимости от вашей специализации
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Standard Questionnaire -->
        <div
          @click="selectQuestionnaireType('standard')"
          class="questionnaire-option p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <div class="flex items-center mb-4">
            <UserIcon class="w-8 h-8 text-blue-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900">Стандартная анкета</h3>
          </div>
          <p class="text-gray-600 mb-4">
            Подходит для большинства специалистов: разработчиков, дизайнеров, маркетологов и других
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• Универсальные разделы портфолио</li>
            <li>• Гибкие настройки специализаций</li>
            <li>• Подходит для любых IT-услуг</li>
          </ul>
        </div>

        <!-- Neural Network Questionnaire -->
        <div
          @click="selectQuestionnaireType('neural-network')"
          class="questionnaire-option p-6 border-2 border-purple-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
          <div class="flex items-center mb-4">
            <CpuChipIcon class="w-8 h-8 text-purple-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900">Анкета для специалистов по ИИ</h3>
            <span class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
              Новое
            </span>
          </div>
          <p class="text-gray-600 mb-4">
            Специализированная анкета для экспертов по нейронным сетям и искусственному интеллекту
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• 8 специализированных блоков</li>
            <li>• Фокус на ИИ-инструментах и проектах</li>
            <li>• Детальная структура портфолио</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Standard Form -->
    <div v-else-if="selectedQuestionnaireType === 'standard'">
      <!-- Back Button -->
      <div class="mb-4">
        <BaseButton
          variant="secondary"
          @click="resetQuestionnaireSelection"
          class="flex items-center"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Назад к выбору типа анкеты
        </BaseButton>
      </div>
    </div>
    <!-- Neural Network Form -->
    <div v-else-if="selectedQuestionnaireType === 'neural-network'">
      <!-- Back Button -->
      <div class="mb-4">
        <BaseButton
          variant="secondary"
          @click="resetQuestionnaireSelection"
          class="flex items-center"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Назад к выбору типа анкеты
        </BaseButton>
      </div>

      <NeuralNetworkQuestionnaireForm
        :initial-data="neuralNetworkInitialData"
        @submit="handleNeuralNetworkSubmit"
        @save-draft="handleNeuralNetworkDraft"
      />
    </div>

    <!-- Original Standard Form Content -->
    <div v-show="selectedQuestionnaireType === 'standard'">
      <!-- Header -->
      <div class="form-header bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ isEditing ? 'Редактировать профиль' : 'Создать профиль специалиста' }}
            </h1>
            <p class="text-gray-600">
              Заполните информацию о себе, чтобы клиенты могли найти и выбрать вас
            </p>
          </div>

          <div class="flex space-x-3">
            <BaseButton type="button" variant="secondary" @click="handleCancel">
              Отмена
            </BaseButton>
            <BaseButton
              type="button"
              @click="handleSave"
              :disabled="!isFormValid || isSaving"
              :loading="isSaving"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </BaseButton>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Заполнено профиля</span>
            <span>{{ Math.round(completionPercentage) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${completionPercentage}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Form Sections -->
      <form @submit.prevent="handleSave" class="space-y-6">
        <!-- Personal Information -->
        <PersonalInfoSection
          v-model="formData.personalInfo"
          :errors="validationErrors.personalInfo"
        />

        <!-- Specializations -->
        <SpecializationsSection
          v-model="formData.specializations"
          :error="validationErrors.specializations"
        />

        <!-- Superpower -->
        <SuperpowerSection v-model="formData.superpower" :error="validationErrors.superpower" />

        <!-- Abilities -->
        <AbilitiesSection v-model="formData.abilities" :error="validationErrors.abilities" />

        <!-- Portfolio -->
        <PortfolioSection v-model="formData.portfolio" />

        <!-- Services -->
        <ServicesSection v-model="formData.services" />

        <!-- Experience -->
        <ExperienceSection v-model="formData.workExperience" />

        <!-- Testimonials -->
        <TestimonialsSection v-model="formData.testimonials" />

        <!-- Contacts -->
        <ContactsSection
          v-model="formData.contacts"
          :errors="validationErrors.contacts"
          :global-error="validationErrors.contactsGlobal"
        />

        <!-- Submit Section -->
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">Готовы опубликовать профиль?</h3>
              <p class="text-sm text-gray-600">
                После сохранения ваш профиль будет отправлен на модерацию
              </p>
            </div>

            <div class="flex space-x-3">
              <BaseButton type="button" variant="secondary" @click="saveDraft" :disabled="isSaving">
                Сохранить черновик
              </BaseButton>

              <BaseButton type="submit" :disabled="!isFormValid || isSaving" :loading="isSaving">
                {{ isFormValid ? 'Отправить на модерацию' : 'Заполните обязательные поля' }}
              </BaseButton>
            </div>
          </div>

          <!-- Validation Summary -->
          <div v-if="!isFormValid" class="mt-4 p-3 bg-yellow-50 rounded-md">
            <h4 class="text-sm font-medium text-yellow-800 mb-2">Необходимо заполнить:</h4>
            <ul class="text-sm text-yellow-700 space-y-1">
              <li v-if="!formData.personalInfo.firstName">• Имя</li>
              <li v-if="!formData.personalInfo.lastName">• Фамилия</li>
              <li v-if="formData.specializations.length === 0">• Специализации</li>
              <li v-if="!formData.superpower || formData.superpower.length < 10">
                • Суперсила (минимум 10 символов)
              </li>
              <li v-if="formData.abilities.length === 0">• Навыки</li>
              <li v-if="!hasValidContact">• Контактная информация</li>
            </ul>
          </div>
        </div>
      </form>
    </div>

    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" :loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSpecialistStore } from '@/stores/specialist'
import { UserIcon, CpuChipIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import NeuralNetworkQuestionnaireForm from './neural-network/NeuralNetworkQuestionnaireForm.vue'

// Form sections
import PersonalInfoSection from './PersonalInfoSection.vue'
import SpecializationsSection from './SpecializationsSection.vue'
import SuperpowerSection from './SuperpowerSection.vue'
import AbilitiesSection from './AbilitiesSection.vue'
import PortfolioSection from './PortfolioSection.vue'
import ServicesSection from './ServicesSection.vue'
import ExperienceSection from './ExperienceSection.vue'
import TestimonialsSection from './TestimonialsSection.vue'
import ContactsSection from './ContactsSection.vue'

import type {
  SpecialistProfile,
  FormState,
  NeuralNetworkFormState,
  PortfolioItem,
  ServiceItem,
  ExperienceItem,
} from '@/types'

interface Props {
  specialist?: SpecialistProfile
  isEditing?: boolean
  onSave?: (profile: SpecialistProfile) => Promise<void>
  onCancel?: () => void
}

interface Emits {
  (e: 'save', profile: SpecialistProfile): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
})

const emit = defineEmits<Emits>()

// Stores
const userStore = useUserStore()
const specialistStore = useSpecialistStore()
const router = useRouter()

// State
const isLoading = ref(false)
const isSaving = ref(false)
const selectedQuestionnaireType = ref<'standard' | 'neural-network' | null>(null)

// Neural network form data
const neuralNetworkInitialData = ref<NeuralNetworkFormState>({} as NeuralNetworkFormState)

// Form data
const formData = ref<FormState>({
  personalInfo: {
    firstName: '',
    lastName: '',
    avatar: '',
    bio: '',
  },
  specializations: [],
  superpower: '',
  abilities: [],
  portfolio: [],
  services: [],
  workExperience: [],
  testimonials: '',
  contacts: {
    telegram: '',
    email: '',
    phone: '',
    website: '',
  },
})

// Validation
const validationErrors = ref({
  personalInfo: {} as Record<string, string>,
  specializations: '',
  superpower: '',
  abilities: '',
  contacts: {} as Record<string, string>,
  contactsGlobal: '',
})

// Computed properties
const isFormValid = computed(() => {
  return !!(
    formData.value.personalInfo.firstName &&
    formData.value.personalInfo.lastName &&
    formData.value.specializations.length > 0 &&
    formData.value.superpower.length >= 10 &&
    formData.value.abilities.length > 0 &&
    hasValidContact.value
  )
})

const hasValidContact = computed(() => {
  const contacts = formData.value.contacts
  return !!(
    contacts.telegram?.trim() ||
    contacts.email?.trim() ||
    contacts.phone?.trim() ||
    contacts.website?.trim()
  )
})

const completionPercentage = computed(() => {
  let completed = 0
  const totalFields = 8

  // Required fields
  if (formData.value.personalInfo.firstName) completed++
  if (formData.value.personalInfo.lastName) completed++
  if (formData.value.specializations.length > 0) completed++
  if (formData.value.superpower.length >= 10) completed++
  if (formData.value.abilities.length > 0) completed++
  if (hasValidContact.value) completed++

  // Optional but recommended
  if (formData.value.portfolio.length > 0) completed++
  if (formData.value.services.length > 0) completed++

  return (completed / totalFields) * 100
})

// Methods
const validateForm = (): boolean => {
  // Reset errors
  validationErrors.value = {
    personalInfo: {},
    specializations: '',
    superpower: '',
    abilities: '',
    contacts: {},
    contactsGlobal: '',
  }

  let isValid = true

  // Personal Info validation
  if (!formData.value.personalInfo.firstName) {
    validationErrors.value.personalInfo.firstName = 'Имя обязательно'
    isValid = false
  }
  if (!formData.value.personalInfo.lastName) {
    validationErrors.value.personalInfo.lastName = 'Фамилия обязательна'
    isValid = false
  }

  // Specializations validation
  if (formData.value.specializations.length === 0) {
    validationErrors.value.specializations = 'Выберите хотя бы одну специализацию'
    isValid = false
  }

  // Superpower validation
  if (!formData.value.superpower) {
    validationErrors.value.superpower = 'Опишите вашу суперсилу'
    isValid = false
  } else if (formData.value.superpower.length < 10) {
    validationErrors.value.superpower = 'Минимум 10 символов'
    isValid = false
  } else if (formData.value.superpower.length > 200) {
    validationErrors.value.superpower = 'Максимум 200 символов'
    isValid = false
  }

  // Abilities validation
  if (formData.value.abilities.length === 0) {
    validationErrors.value.abilities = 'Добавьте хотя бы один навык'
    isValid = false
  }

  // Contacts validation
  if (!hasValidContact.value) {
    validationErrors.value.contactsGlobal = 'Укажите хотя бы один способ связи'
    isValid = false
  }

  // Email format validation
  const email = formData.value.contacts.email
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    validationErrors.value.contacts.email = 'Неверный формат email'
    isValid = false
  }

  // URL format validation
  const website = formData.value.contacts.website
  if (website && !/^https?:\/\/.+/.test(website)) {
    validationErrors.value.contacts.website = 'URL должен начинаться с http:// или https://'
    isValid = false
  }

  return isValid
}

const createProfileFromFormData = (): SpecialistProfile => {
  const userId = userStore.currentUser?.id || ''

  return {
    id: props.specialist?.id || '',
    userId,
    personalInfo: { ...formData.value.personalInfo },
    specializations: [...formData.value.specializations],
    superpower: formData.value.superpower,
    abilities: [...formData.value.abilities],
    portfolio: [...formData.value.portfolio],
    services: [...formData.value.services],
    workExperience: [...formData.value.workExperience],
    testimonials: formData.value.testimonials,
    contacts: { ...formData.value.contacts },
    status: isFormValid.value ? 'pending' : 'draft',
    profileCompleted: isFormValid.value,
    createdAt: props.specialist?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

const handleSave = async () => {
  if (!validateForm()) {
    return
  }

  isSaving.value = true

  try {
    const profile = createProfileFromFormData()

    if (props.onSave) {
      await props.onSave(profile)
    } else {
      await specialistStore.saveProfile(profile)
    }

    emit('save', profile)

    // Redirect to profile view
    await router.push('/profile')
  } catch (error) {
    console.error('Failed to save profile:', error)
    alert('Ошибка при сохранении профиля. Попробуйте снова.')
  } finally {
    isSaving.value = false
  }
}

const saveDraft = async () => {
  isSaving.value = true

  try {
    const profile = createProfileFromFormData()
    profile.status = 'draft'
    profile.profileCompleted = false

    if (props.onSave) {
      await props.onSave(profile)
    } else {
      await specialistStore.saveProfile(profile)
    }

    alert('Черновик сохранен')
  } catch (error) {
    console.error('Failed to save draft:', error)
    alert('Ошибка при сохранении черновика. Попробуйте снова.')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  if (props.onCancel) {
    props.onCancel()
  } else {
    emit('cancel')
    router.back()
  }
}

const loadExistingProfile = () => {
  if (props.specialist) {
    formData.value = {
      personalInfo: { ...props.specialist.personalInfo },
      specializations: [...props.specialist.specializations],
      superpower: props.specialist.superpower,
      abilities: [...props.specialist.abilities],
      portfolio: [...props.specialist.portfolio],
      services: [...props.specialist.services],
      workExperience: [...props.specialist.workExperience],
      testimonials: props.specialist.testimonials,
      contacts: { ...props.specialist.contacts },
    }
  }
}

// Questionnaire type selection methods
const selectQuestionnaireType = (type: 'standard' | 'neural-network') => {
  selectedQuestionnaireType.value = type
}

const resetQuestionnaireSelection = () => {
  selectedQuestionnaireType.value = null
}

// Neural network form handlers
const handleNeuralNetworkSubmit = async (data: NeuralNetworkFormState) => {
  isSaving.value = true
  try {
    // Convert neural network data to standard profile format
    const profile = convertNeuralNetworkToProfile(data)

    if (props.onSave) {
      await props.onSave(profile)
    } else {
      await specialistStore.saveProfile(profile)
    }

    emit('save', profile)
    await router.push('/profile')
  } catch (error) {
    console.error('Failed to save neural network profile:', error)
    alert('Ошибка при сохранении профиля. Попробуйте снова.')
  } finally {
    isSaving.value = false
  }
}

const handleNeuralNetworkDraft = async (data: NeuralNetworkFormState) => {
  isSaving.value = true
  try {
    const profile = convertNeuralNetworkToProfile(data)
    profile.status = 'draft'
    profile.profileCompleted = false

    if (props.onSave) {
      await props.onSave(profile)
    } else {
      await specialistStore.saveProfile(profile)
    }

    alert('Черновик сохранен')
  } catch (error) {
    console.error('Failed to save neural network draft:', erroer)
    alert('Ошибка при сохранении черновика. Попробуйте снова.')
  } finally {
    isSaving.value = false
  }
}

// Convert neural network form data to standard profile format
const convertNeuralNetworkToProfile = (data: NeuralNetworkFormState): SpecialistProfile => {
  const userId = userStore.currentUser?.id || ''

  // Extract personal info from the first available data
  const firstName = userStore.currentUser?.firstName || ''
  const lastName = userStore.currentUser?.lastName || ''
  const avatar = userStore.currentUser?.avatar || ''

  // Convert specializations object to string array
  const specializations = Object.entries(data.specializations)
    .filter(([_, value]) => value)
    .map(([key, _]) => {
      switch (key) {
        case 'neuralAssistants':
          return 'Нейронные ассистенты'
        case 'neuralFunnels':
          return 'Нейронные воронки'
        case 'contentGeneration':
          return 'Генерация контента'
        case 'visuals':
          return 'Визуалы'
        case 'audioVideoProcessing':
          return 'Обработка аудио/видео'
        case 'promptBases':
          return 'Промпт-базы'
        case 'chatbotSetup':
          return 'Настройка чат-ботов'
        case 'neuralNetworkTraining':
          return 'Обучение нейросетей'
        default:
          return key
      }
    })

  // Convert abilities object to string array
  const abilities = Object.entries(data.abilities)
    .filter(([_, value]) => value)
    .map(([key, _]) => {
      switch (key) {
        case 'funnelAssembly':
          return 'Сборка воронок'
        case 'personalAIAssistants':
          return 'Персональные ИИ-ассистенты'
        case 'sellingTextsWithGPT':
          return 'Продающие тексты с GPT'
        case 'visualGeneration':
          return 'Генерация визуалов'
        case 'reelsContentAI':
          return 'Контент для Reels с ИИ'
        case 'videoProcessing':
          return 'Обработка видео'
        case 'funnelAutomation':
          return 'Автоматизация воронок'
        case 'promptBases':
          return 'Промпт-базы'
        case 'trainingConsultations':
          return 'Консультации по обучению'
        default:
          return key
      }
    })

  // Convert portfolio cases to portfolio items
  const portfolio: PortfolioItem[] = data.portfolio.map(portfolioCase => ({
    id: portfolioCase.id,
    title: portfolioCase.title,
    description: portfolioCase.description,
    result: portfolioCase.result,
    tools: portfolioCase.tools || [],
    linkUrl: portfolioCase.type === 'link' ? (portfolioCase.content as string) : undefined,
    imageUrl: portfolioCase.type === 'visual' ? (portfolioCase.content as string) : undefined,
  }))

  // Convert service offerings to service items
  const services: ServiceItem[] = data.services.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
  }))

  // Convert work experience
  const workExperience: ExperienceItem[] = data.experience.map(exp => ({
    id: exp.id,
    client: exp.client,
    task: exp.task,
    tools: exp.tools,
    result: exp.result,
    duration: exp.duration,
  }))

  // Convert testimonials to string (simple concatenation for now)
  const testimonialsText = data.testimonials.externalLinks.join('; ')

  return {
    id: props.specialist?.id || '',
    userId,
    personalInfo: {
      firstName,
      lastName,
      avatar,
      bio: data.superpower,
    },
    specializations,
    superpower: data.superpower,
    abilities,
    portfolio,
    services,
    workExperience,
    testimonials: testimonialsText,
    contacts: {
      telegram: data.contacts.telegram,
      email: data.contacts.email,
      phone: '',
      website: data.contacts.website || '',
    },
    status: 'pending',
    profileCompleted: true,
    createdAt: props.specialist?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Lifecycle
onMounted(() => {
  loadExistingProfile()

  // Auto-select questionnaire type for existing profiles
  if (props.specialist) {
    // Check if this is a neural network specialist based on specializations
    const isNeuralNetworkSpecialist = props.specialist.specializations.some(
      spec =>
        spec.toLowerCase().includes('нейронн') ||
        spec.toLowerCase().includes('ии') ||
        spec.toLowerCase().includes('ai') ||
        spec.toLowerCase().includes('машинное обучение')
    )

    selectedQuestionnaireType.value = isNeuralNetworkSpecialist ? 'neural-network' : 'standard'
  }
})

// Watch for changes in specialist prop
watch(
  () => props.specialist,
  newSpecialist => {
    if (newSpecialist) {
      loadExistingProfile()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.specialist-profile-form {
  @apply max-w-4xl mx-auto p-4;
}

.form-header {
  @apply sticky top-0 z-10;
}
</style>
