<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex items-center space-x-3 mb-6">
          <QuestionMarkCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Поддержка
          </h1>
        </div>
        
        <!-- Support Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- FAQ -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-4">
              <BookOpenIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Часто задаваемые вопросы
              </h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Найдите ответы на популярные вопросы о платформе
            </p>
            <button class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              Перейти к FAQ →
            </button>
          </div>

          <!-- Contact Support -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-4">
              <ChatBubbleLeftRightIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Связаться с поддержкой
              </h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Получите персональную помощь от нашей команды
            </p>
            <button class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              Написать в поддержку →
            </button>
          </div>

          <!-- Documentation -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-4">
              <DocumentTextIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Документация
              </h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Изучите подробные руководства по использованию платформы
            </p>
            <button class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              Открыть документацию →
            </button>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Обратиться в поддержку
          </h2>
          
          <form class="grid grid-cols-1 gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ваше имя"
                >
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                >
              </div>
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тема
              </label>
              <select
                id="subject"
                v-model="form.subject"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
Выберите тему
</option>
                <option value="technical">
Техническая проблема
</option>
                <option value="account">
Проблемы с аккаунтом
</option>
                <option value="billing">
Вопросы по оплате
</option>
                <option value="feature">
Предложение функции
</option>
                <option value="other">
Другое
</option>
              </select>
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Сообщение
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Опишите вашу проблему или вопрос..."
              />
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                       rounded-md transition-colors focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2"
                @click.prevent="submitForm"
              >
                Отправить сообщение
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitForm = () => {
  // Mock form submission
  alert('Форма отправлена! (это заглушка, функционал в разработке)')
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
}
</script>