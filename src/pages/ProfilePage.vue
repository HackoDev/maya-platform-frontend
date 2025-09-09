<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex items-center space-x-3 mb-6">
          <UserCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Мой профиль
          </h1>
        </div>
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Имя
</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ userStore.currentUser.firstName }}
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Фамилия
</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ userStore.currentUser.lastName }}
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Email
</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ userStore.currentUser.email }}
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Тип пользователя
</dt>
              <dd class="mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    userStore.currentUser.userType === 'specialist'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  "
                >
                  {{ userStore.currentUser.userType === 'specialist' ? 'Специалист' : 'Клиент' }}
                </span>
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Статус
</dt>
              <dd class="mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    userStore.currentUser.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  "
                >
                  {{ userStore.currentUser.isActive ? 'Активен' : 'Неактивен' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Страница профиля находится в разработке. Здесь будет доступно редактирование профиля, загрузка аватара и другие настройки.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>