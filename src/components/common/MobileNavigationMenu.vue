<template>
  <!-- Mobile menu overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Mobile menu panel -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 
             shadow-xl transform lg:hidden"
    >
      <!-- Menu Header -->
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <span class="text-lg font-semibold text-gray-900 dark:text-white"> Меню </span>
        <button
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 
                 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-100 
                 dark:hover:bg-gray-700 transition-colors"
          @click="$emit('close')"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- User Status Badges (Mobile) -->
      <div v-if="user" class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <!-- Specialist Portfolio Status -->
        <div
          v-if="user.userType === 'specialist'"
          class="text-left"
        >
          <button
            @click="goToSpecialistQuestionnaire"
            class="text-xs font-medium px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            :class="portfolioStatusButton.classes"
            title="Перейти к анкете специалиста"
          >
            {{ portfolioStatusButton.text }}
          </button>
        </div>

        <!-- Admin Status -->
        <div
          v-if="user.userType === 'admin'"
          class="text-left"
        >
          <span class="text-xs font-medium px-2 py-1 rounded-full" :class="adminStatusButton.classes">
            {{ adminStatusButton.text }}
          </span>
        </div>

        <!-- Create Vacancy Button for Clients -->
        <button
          v-if="user.userType === 'client'"
          @click="handleCreateVacancy"
          class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Создать вакансию
        </button>
      </div>

      <!-- Navigation Items -->
      <div class="py-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.id"
          :to="item.route"
          class="flex items-center px-4 py-3 text-base font-medium 
                 text-gray-700 dark:text-gray-300 hover:text-gray-900 
                 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 
                 border-l-4 border-transparent hover:border-blue-500 transition-colors"
          :class="{ 
            'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-500': 
            isActiveRoute(item.route) 
          }"
          @click="$emit('close')"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Logout Section (Simplified) -->
      <div
        class="absolute bottom-0 left-0 right-0 p-4 border-t 
               border-gray-200 dark:border-gray-700"
      >
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center px-4 py-3 
                 text-sm font-medium text-red-600 dark:text-red-400 
                 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 
                 dark:hover:bg-red-900/30 rounded-md transition-colors 
                 duration-150 focus:outline-none focus:ring-2 
                 focus:ring-red-500 focus:ring-offset-2"
        >
          <ArrowRightOnRectangleIcon class="h-4 w-4 mr-2" />
          Выйти
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { XMarkIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import type { NavigationItem, User } from '@/types'

interface Props {
  isOpen: boolean
  navigationItems: NavigationItem[]
  user?: User | null
}

interface Emits {
  close: []
  'create-vacancy': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isActiveRoute = (path: string) => {
  return route.path === path
}

// Portfolio status badge/button (specialists only)
const portfolioStatus = computed(() => props.user?.portfolioStatus ?? null)
const portfolioStatusButton = computed(() => {
  const status = portfolioStatus.value
  if (status === 'published') {
    return {
      text: 'Анкета: опубликована',
      classes: 'text-white bg-green-600',
      dot: 'bg-white'
    }
  }
  if (status === 'draft') {
    return {
      text: 'Анкета: черновик',
      classes: 'text-white bg-[#FF9800]',
      dot: 'bg-white'
    }
  }
  if (status === 'archived') {
    return {
      text: 'Анкета: архивирована',
      classes: 'text-white bg-red-600',
      dot: 'bg-white'
    }
  }
  return {
    text: 'Не создана',
    classes: 'text-white bg-red-600',
    dot: 'bg-white'
  }
})

// Admin status badge/button (admins only)
const adminStatusButton = computed(() => {
  return {
    text: 'Администратор',
    classes: 'text-white bg-purple-600',
    dot: 'bg-white'
  }
})

const handleLogout = async () => {
  emit('close')
  await userStore.logoutWithRedirect('/login')
}

const handleCreateVacancy = () => {
  emit('create-vacancy')
  emit('close')
}

const goToSpecialistQuestionnaire = () => {
  router.push('/profile/neural-network')
  emit('close')
}
</script>