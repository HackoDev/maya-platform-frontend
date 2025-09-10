<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="flex items-center space-x-3">
            <QuestionMarkCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Центр поддержки
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Найдите ответы на вопросы или свяжитесь с нашей командой поддержки
              </p>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <FAQSection
            :faqs="faqs"
            :loading="loading.faqs"
            :error="error"
            @toggle-faq="handleToggleFAQ"
            @refresh="handleRefreshFAQs"
            @feedback="handleFAQFeedback"
          />
        </div>

        <!-- Support History Section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <SupportHistorySection
            :tickets="recentTickets"
            :loading="loading.tickets"
            :error="error"
            @ticket-click="handleTicketClick"
            @view-all="handleViewAllTickets"
            @filter="handleFilterTickets"
            @refresh="handleRefreshTickets"
            @retry="handleRefreshTickets"
          />
        </div>

        <!-- Support Form Section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <SupportForm
            :visible="showSupportForm"
            :loading="loading.submission"
            :error="error"
            @toggle="handleToggleSupportForm"
            @submit="handleSubmitSupportRequest"
            @cancel="handleCancelSupportForm"
          />
        </div>

        <!-- Quick Links Section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Дополнительные ресурсы
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="#"
              class="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <DocumentTextIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  Документация
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Руководства и API
                </p>
              </div>
            </a>
            
            <a
              href="#"
              class="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <VideoCameraIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  Видео-туториалы
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Обучающие материалы
                </p>
              </div>
            </a>
            
            <a
              href="#"
              class="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  Сообщество
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Форум пользователей
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/vue/24/outline'
import { useSupportData } from '@/composables/useSupportData'
import FAQSection from '@/components/support/FAQSection.vue'
import SupportHistorySection from '@/components/support/SupportHistorySection.vue'
import SupportForm from '@/components/support/SupportForm.vue'
import type { SupportTicket } from '@/types'

// Composables
const {
  faqs,
  recentTickets,
  loading,
  error,
  refreshFAQs,
  refreshTickets,
  submitTicket,
  toggleFAQ,
  isFAQExpanded,
  clearErrors,
  setCurrentTicket,
} = useSupportData()

// Local state
const showSupportForm = ref(false)

// Event handlers
const handleToggleFAQ = (faqId: string): void => {
  toggleFAQ(faqId)
}

const handleRefreshFAQs = async (): Promise<void> => {
  try {
    await refreshFAQs()
  } catch (err) {
    console.error('Failed to refresh FAQs:', err)
  }
}

const handleFAQFeedback = (data: { faqId: string; isHelpful: boolean }): void => {
  // Log feedback for analytics (could be sent to backend)
  console.log('FAQ feedback:', data)
  
  // Show user acknowledgment
  const message = data.isHelpful 
    ? 'Спасибо за отзыв!' 
    : 'Мы работаем над улучшением ответов'
  
  // Could be replaced with proper toast notification
  console.log(message)
}

const handleTicketClick = (ticket: SupportTicket): void => {
  setCurrentTicket(ticket)
  // Navigate to ticket detail page or show modal
  console.log('Navigate to ticket:', ticket.id)
}

const handleViewAllTickets = (): void => {
  // Navigate to tickets list page
  console.log('Navigate to all tickets')
}

const handleFilterTickets = (status: SupportTicket['status']): void => {
  // Filter tickets by status
  console.log('Filter tickets by status:', status)
}

const handleRefreshTickets = async (): Promise<void> => {
  try {
    await refreshTickets()
  } catch (err) {
    console.error('Failed to refresh tickets:', err)
  }
}

const handleToggleSupportForm = (): void => {
  showSupportForm.value = !showSupportForm.value
  
  // Clear any existing errors when toggling form
  if (showSupportForm.value) {
    clearErrors()
  }
}

const handleSubmitSupportRequest = async (message: string): Promise<void> => {
  try {
    await submitTicket(message)
    
    // Hide form after successful submission
    showSupportForm.value = false
    
    // Refresh tickets to show the new one
    await refreshTickets()
    
    console.log('Support request submitted successfully')
  } catch (err) {
    console.error('Failed to submit support request:', err)
    // Error is handled by the composable and displayed in the form
  }
}

const handleCancelSupportForm = (): void => {
  showSupportForm.value = false
  clearErrors()
}

// Lifecycle
onMounted(() => {
  // Data is automatically loaded by the composable
  console.log('Support page mounted')
})
</script>