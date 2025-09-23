<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <TopNavbar @create-vacancy="handleCreateVacancy" />
    <RouterView />
    
    <!-- Global Vacancy Form Modal -->
    <VacancyForm 
      :is-open="vacancyStore.showVacancyForm"
      :vacancy="vacancyStore.selectedVacancy"
      @close="vacancyStore.closeVacancyForm"
      @save="handleSaveVacancy"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import TopNavbar from '@/components/common/TopNavbar.vue'
import VacancyForm from '@/components/vacancies/VacancyForm.vue'
import { useVacancyStore } from '@/stores/vacancy'
import type { Vacancy } from '@/types/vacancy'

// Router
const router = useRouter()

// Stores
const vacancyStore = useVacancyStore()

// Methods
const handleCreateVacancy = () => {
  vacancyStore.openVacancyForm()
}

const handleSaveVacancy = async (vacancyData: Partial<Vacancy>) => {
  try {
    if (vacancyStore.selectedVacancy) {
      // Update existing vacancy
      await vacancyStore.updateVacancy(vacancyStore.selectedVacancy.id, vacancyData)
    } else {
      // Create new vacancy
      const newVacancy = await vacancyStore.createVacancy(vacancyData)
      // Redirect to the newly created vacancy details page
      router.push(`/profile/vacancies/${newVacancy.id}`)
    }
    vacancyStore.closeVacancyForm()
  } catch (err) {
    // Error is handled in the form component
    throw err
  }
}
</script>
