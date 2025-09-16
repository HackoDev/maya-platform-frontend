<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <QuestionMarkCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Центр поддержки
            </h1>
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Найдите ответы на вопросы или свяжитесь с нашей командой поддержки
          </p>
        </div>

        <!-- FAQ Section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <SimpleFAQSection
            :faqs="simplifiedFAQs"
            :loading="loading.faqs"
            :error="error"
            @toggle-faq="handleToggleFAQ"
            @refresh="handleRefreshFAQs"
          />
        </div>

        <!-- Support History Section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <SupportHistorySection
            ref="supportHistoryRef"
            :tickets="recentTickets"
            :loading="loading.tickets"
            :error="error"
            @ticket-click="handleTicketClick"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/outline'
import { useSupportData } from '@/composables/useSupportData'
import SimpleFAQSection from '@/components/support/SimpleFAQSection.vue'
import SupportHistorySection from '@/components/support/SupportHistorySection.vue'
import SupportForm from '@/components/support/SupportForm.vue'
import type { SupportTicket, SimplifiedFAQ } from '@/types'

// Composables
const router = useRouter()
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

// Template refs
const supportHistoryRef = ref<InstanceType<typeof SupportHistorySection> | null>(null)

// Local state
const showSupportForm = ref(false)

// Computed properties
const simplifiedFAQs = computed((): SimplifiedFAQ[] => {
  return faqs.value.map(faq => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    priority: faq.priority,
    isPopular: faq.isPopular
  }))
})

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

const handleTicketClick = (ticket: SupportTicket): void => {
  setCurrentTicket(ticket)
  // Navigate to ticket detail page
  router.push({ name: 'SupportTicketDialog', params: { id: ticket.id } })
}

const handleRefreshTickets = async (): Promise<void> => {
  try {
    await refreshTickets()
    // Reset refresh loading state in child component
    if (supportHistoryRef.value) {
      supportHistoryRef.value.handleRefreshComplete()
    }
  } catch (err) {
    console.error('Failed to refresh tickets:', err)
    // Reset refresh loading state even on error
    if (supportHistoryRef.value) {
      supportHistoryRef.value.handleRefreshComplete()
    }
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