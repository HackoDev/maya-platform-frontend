<template>
  <div class="abilities-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 3. Что ты умеешь?
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Твои навыки и умения
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Отметь то, что делаешь, чтобы клиенту было понятно, с чем ты можешь помочь
      </p>
    </div>

    <div class="space-y-4">
      <!-- Abilities Options Grid -->
      <div v-if="store.portfolioDataLoading" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">Загрузка навыков...</div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          v-for="skill in store.skills"
          :key="skill.id"
          class="relative flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600': isSkillSelected(skill.id) }"
        >
          <input
            type="checkbox"
            :checked="isSkillSelected(skill.id)"
            @change="updateAbility(skill.id, ($event.target as HTMLInputElement).checked)"
            class="sr-only"
          />
          <div class="flex items-start">
            <div
              class="flex-shrink-0 w-5 h-5 border-2 rounded transition-colors mt-0.5"
              :class="isSkillSelected(skill.id) 
                ? 'bg-green-600 border-green-600' 
                : 'border-gray-300 dark:border-gray-500'"
            >
              <svg
                v-if="isSkillSelected(skill.id)"
                class="w-3 h-3 text-white mx-auto mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ skill.name }}
              </div>
              <div v-if="skill.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ skill.description }}
              </div>
              <div v-if="skill.tags && skill.tags.length > 0" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Инструменты: {{ skill.tags.join(', ') }}
              </div>
            </div>
          </div>
        </label>
      </div>

      <!-- Custom Abilities -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Дополнительные навыки (если не нашли подходящих выше)
        </label>
        <div class="space-y-2">
          <div
            v-for="(custom, index) in customAbilities"
            :key="index"
            class="flex items-center space-x-2"
          >
            <input
              v-model="custom.value"
              type="text"
              placeholder="Например: Настройка интеграций с CRM..."
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-sm"
              @input="updateCustomAbilities"
            />
            <button
              @click="removeCustomAbility(index)"
              class="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click="addCustomAbility"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить навык
          </button>
        </div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
        <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
      </div>

      <!-- Selection Summary -->
      <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          📊 Выбрано навыков: {{ selectedCount }}
        </h4>
        <div v-if="selectedCount > 0" class="text-xs text-gray-600 dark:text-gray-400">
          Отлично! Клиенты смогут лучше понять, с чем вы можете помочь.
        </div>
      </div>

      <!-- Helpful Tips -->
      <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Рекомендации по выбору навыков:
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Выбирайте только те навыки, которыми действительно владеете</li>
          <li>• Лучше указать меньше навыков, но качественно их выполнять</li>
          <li>• Если есть портфолио по навыку — обязательно добавьте его в следующем блоке</li>
          <li>• Сочетайте технические и консультационные навыки для большей привлекательности</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useNeuralNetworkProfileStore()

const customAbilities = ref<{ value: string }[]>([])
const validationError = ref('')

const selectedCount = computed(() => {
  return props.formState.abilities.selectedSkillIds.length + (props.formState.abilities.customAbilities?.length || 0)
})

const isSkillSelected = (skillId: number): boolean => {
  return props.formState.abilities.selectedSkillIds.includes(skillId)
}

// Initialize custom abilities from form state
if (props.formState.abilities.customAbilities?.length) {
  customAbilities.value = props.formState.abilities.customAbilities.map(value => ({ value }))
}

const updateAbility = (skillId: number, checked: boolean) => {
  store.updateSkillSelection(skillId, checked)
  validateBlock()
}

const addCustomAbility = () => {
  customAbilities.value.push({ value: '' })
}

const removeCustomAbility = (index: number) => {
  customAbilities.value.splice(index, 1)
  updateCustomAbilities()
}

const updateCustomAbilities = () => {
  const customValues = customAbilities.value
    .map(item => item.value.trim())
    .filter(value => value.length > 0)
  
  emit('update', 'abilities', 'customAbilities', customValues)
  validateBlock()
}

const validateBlock = () => {
  validationError.value = ''
  
  if (selectedCount.value === 0) {
    validationError.value = 'Выберите хотя бы один навык'
  }
  
  emit('validate', '3')
}

// Watch for changes and validate
watch(() => props.formState.abilities, validateBlock, { deep: true })
</script>