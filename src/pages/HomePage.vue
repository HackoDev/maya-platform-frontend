<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to
          <span class="text-primary-600">Maya Platform</span>
        </h1>
        <p
          class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
        >
          A modern Vue.js application built with best practices, featuring TypeScript, Tailwind CSS,
          and comprehensive tooling.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <router-link
              to="/dashboard"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </router-link>
          </div>
          <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <router-link
              to="/about"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </router-link>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mt-20">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="pt-6">
            <div class="flow-root bg-white rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div
                  class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg"
                >
                  <span class="text-white text-2xl">⚡</span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Lightning Fast
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  Built with Vite for blazing fast development and optimized production builds.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flow-root bg-white rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div
                  class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg"
                >
                  <span class="text-white text-2xl">🛡️</span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
Type Safe
</h3>
                <p class="mt-5 text-base text-gray-500">
                  Full TypeScript support with strict type checking for reliable code.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flow-root bg-white rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div
                  class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg"
                >
                  <span class="text-white text-2xl">🎨</span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
Beautiful UI
</h3>
                <p class="mt-5 text-base text-gray-500">
                  Styled with Tailwind CSS for rapid and consistent design development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// HomePage component with modern design
</script>
