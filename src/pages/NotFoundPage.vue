<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 class="text-6xl font-bold text-center text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-8">Page Not Found</h2>
      <p class="text-center text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="flex justify-center space-x-4">
        <router-link
          to="/"
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Go Home
        </router-link>
        <button
          class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
          @click="$router.back()"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page handles 404 errors
</script>
