<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useGlobalSession } from '@/composables/useSession'
import ControlledToggle from '@/components/ui/ControlledToggle.vue'
import { useUserStore } from '@/stores/user'

const session = useGlobalSession()
const userStore = useUserStore()
const userType = computed(() => session.currentUser.value?.userType as 'specialist' | 'client' | undefined)
const consentAccepted = ref(false)
const isSubmittingConsent = ref(false)
const showConsentSuccess = ref(false)

// Keep UI toggle in sync with current user's saved consent
watchEffect(() => {
  const accepted = session.currentUser.value?.generalConsentAccepted ?? false
  consentAccepted.value = !!accepted
})

async function submitGeneralConsent() {
  if (!consentAccepted.value) return
  try {
    isSubmittingConsent.value = true
    await userStore.updateGeneralConsentAccepted()
    showConsentSuccess.value = true
  } finally {
    isSubmittingConsent.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 space-y-8">
    <div class="rounded-2xl p-6 md:p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="space-y-3">
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Добро пожаловать в MayaWork</h1>
        <p class="text-gray-600 dark:text-gray-300">
          Здесь вы управляете своими данными и согласиями. В зависимости от вашей роли мы
          предложим следующий шаг: заполнить анкету специалиста или начать поиск специалистов и управление вакансиями.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <RouterLink v-if="userType === 'specialist'" to="/profile/neural-network" class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900 transition">
            Перейти к анкете специалиста
          </RouterLink>
          <RouterLink v-if="userType === 'client'" to="/search/specialists" class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 dark:focus:ring-offset-gray-900 transition">
            Найти специалиста
          </RouterLink>
          <RouterLink to="/support" class="inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md shadow-sm bg-transparent text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-offset-gray-900 transition">
            Центр поддержки
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="rounded-2xl p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Какие данные мы собираем</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
        <div class="space-y-1">
          <p class="font-semibold">Общие (для всех пользователей)</p>
          <ul class="list-disc pl-5 text-sm space-y-1">
            <li>Имя</li>
            <li>Фамилия</li>
            <li>Email</li>
            <li>Телефон</li>
            <li>WhatsApp</li>
            <li>Telegram</li>
          </ul>
        </div>
        <div class="space-y-1">
          <p class="font-semibold">Дополнительно для специалистов</p>
          <ul class="list-disc pl-5 text-sm space-y-1">
            <li>Коротко о себе (суперсила)</li>
            <li>Навыки и специализации</li>
            <li>Портфолио и кейсы</li>
            <li>Услуги и цены</li>
            <li>Опыт и отзывы</li>
          </ul>
        </div>
      </div>
      <div class="mt-4 space-y-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Данные используются для улучшения качества сервиса и подбора релевантных предложений.<br />
          <a href="#" class="underline hover:no-underline">Политика конфиденциальности</a> ·
          <a href="#" class="underline hover:no-underline">Условия сервиса</a>
        </p>
        <p class="text-sm" :class="(session.currentUser.value?.generalConsentAccepted ? 'text-gray-700 dark:text-gray-200 text-sm' : 'text-red-600 dark:text-red-400 text-md')">
          Для продолжения работы на платформе <span class="font-semibold">необходимо</span> дать согласие на обработку персональных данных.
        </p>
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <ControlledToggle
            :model-value="consentAccepted"
            :disabled="consentAccepted"
            @toggle-requested="consentAccepted = $event"
            label="Согласен на обработку персональных данных"
          />
          <button
            :disabled="!consentAccepted || isSubmittingConsent || session.currentUser.value?.generalConsentAccepted"
            @click="submitGeneralConsent"
            class="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <span
              v-if="isSubmittingConsent"
              class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            <span>{{ isSubmittingConsent ? 'Отправка...' : 'Отправить согласие' }}</span>
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          В случае если вы хотите удалить аккаунт или запросить персональные данные, обратитесь в
          <RouterLink to="/support" class="underline hover:no-underline">службу поддержки</RouterLink>.
        </p>
      </div>
    </div>
  </div>

  <BaseModal :show="showConsentSuccess" title="Согласие получено" @close="showConsentSuccess = false">
    <div class="space-y-2">
      <p class="text-gray-700 dark:text-gray-200">Теперь вы можете пользоваться платформой.</p>
    </div>
    <template #footer>
      <button
        class="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900"
        @click="showConsentSuccess = false"
      >
        Продолжить
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
</style>
