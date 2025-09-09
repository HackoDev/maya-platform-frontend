<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
About Maya Platform
</h1>
        <p class="mt-4 text-xl text-gray-600">
          Built with modern Vue.js and industry best practices
        </p>
      </div>

      <div class="mt-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Technology Stack -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
Technology Stack
</h2>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-500 rounded-full" />
                <span class="text-gray-700">Vue 3 with Composition API</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-blue-500 rounded-full" />
                <span class="text-gray-700">TypeScript for type safety</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-purple-500 rounded-full" />
                <span class="text-gray-700">Vite for fast development</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-cyan-500 rounded-full" />
                <span class="text-gray-700">Tailwind CSS for styling</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-yellow-500 rounded-full" />
                <span class="text-gray-700">Pinia for state management</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-red-500 rounded-full" />
                <span class="text-gray-700">Vue Router for navigation</span>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
Key Features
</h2>
            <div class="space-y-4">
              <div class="border-l-4 border-primary-500 pl-4">
                <h3 class="font-semibold text-gray-900">
Modern Architecture
</h3>
                <p class="text-gray-600">
Component-based architecture with Vue 3 Composition API
</p>
              </div>
              <div class="border-l-4 border-primary-500 pl-4">
                <h3 class="font-semibold text-gray-900">
Type Safety
</h3>
                <p class="text-gray-600">
Full TypeScript coverage with strict type checking
</p>
              </div>
              <div class="border-l-4 border-primary-500 pl-4">
                <h3 class="font-semibold text-gray-900">
Development Tools
</h3>
                <p class="text-gray-600">
ESLint, Prettier, Husky for code quality
</p>
              </div>
              <div class="border-l-4 border-primary-500 pl-4">
                <h3 class="font-semibold text-gray-900">
Testing Ready
</h3>
                <p class="text-gray-600">
Vitest setup with example unit tests
</p>
              </div>
              <div class="border-l-4 border-primary-500 pl-4">
                <h3 class="font-semibold text-gray-900">
Performance
</h3>
                <p class="text-gray-600">
Optimized builds with code splitting and lazy loading
</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
Project Structure
</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ componentCount }}
              </div>
              <div class="text-gray-600">
UI Components
</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ pageCount }}
              </div>
              <div class="text-gray-600">
Pages
</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ storeCount }}
              </div>
              <div class="text-gray-600">
Stores
</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ composableCount }}
              </div>
              <div class="text-gray-600">
Composables
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Project stats
const componentCount = 8
const pageCount = 4
const storeCount = 2
const composableCount = 4
</script>
