<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex items-center space-x-3 mb-6">
          <MagnifyingGlassIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Поиск специалиста
          </h1>
        </div>
        
        <!-- Search Form -->
        <div class="mb-8">
          <div class="max-w-md">
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Поиск по специальности
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Введите специальность..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Категория
            </label>
            <select
              v-model="selectedCategory"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
Все категории
</option>
              <option value="medicine">
Медицина
</option>
              <option value="education">
Образование
</option>
              <option value="technology">
Технологии
</option>
              <option value="business">
Бизнес
</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Опыт работы
            </label>
            <select
              v-model="selectedExperience"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
Любой опыт
</option>
              <option value="junior">
До 2 лет
</option>
              <option value="middle">
2-5 лет
</option>
              <option value="senior">
5+ лет
</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Рейтинг
            </label>
            <select
              v-model="selectedRating"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
Любой рейтинг
</option>
              <option value="5">
5 звезд
</option>
              <option value="4">
4+ звезд
</option>
              <option value="3">
3+ звезд
</option>
            </select>
          </div>
        </div>

        <!-- Results placeholder -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="text-center py-12">
            <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Поиск специалистов
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Функционал поиска специалистов находится в разработке.
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Здесь будут отображаться результаты поиска специалистов по заданным критериям.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedExperience = ref('')
const selectedRating = ref('')
</script>