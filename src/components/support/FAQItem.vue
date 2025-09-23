<template>
  <div 
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    :data-testid="`faq-item-${faq.id}`"
  >
    <button
      type="button"
      class="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
      :class="[
        expanded ? 'border-b border-gray-200 dark:border-gray-700' : '',
        'hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200'
      ]"
      @click="handleToggle"
      @keydown.enter="handleToggle"
      @keydown.space.prevent="handleToggle"
      :aria-expanded="expanded"
      :aria-controls="`faq-answer-${faq.id}`"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 pr-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ faq.question }}
          </h3>
        </div>
        <div class="flex-shrink-0">
          <ChevronDownIcon 
            class="h-6 w-6 text-gray-400 dark:text-gray-500 transition-transform duration-300"
            :class="{ 'rotate-180': expanded }"
          />
        </div>
      </div>
    </button>
    
    <Transition
      name="faq-answer"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div 
        v-show="expanded"
        :id="`faq-answer-${faq.id}`"
        :data-testid="`faq-answer-${faq.id}`"
        class="overflow-hidden"
        role="region"
        :aria-labelledby="`faq-question-${faq.id}`"
      >
        <div class="px-6 pb-4">
          <p 
            class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
            v-html="formattedAnswer"
          />
          
          <!-- Helpful actions -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Был ли ответ полезен?
              </span>
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  class="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                  @click="handleHelpful(true)"
                  :aria-label="'Ответ полезен для FAQ: ' + faq.question"
                >
                  <HandThumbUpIcon class="h-4 w-4" />
                  <span>Да</span>
                </button>
                <button
                  type="button"
                  class="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  @click="handleHelpful(false)"
                  :aria-label="'Ответ не полезен для FAQ: ' + faq.question"
                >
                  <HandThumbDownIcon class="h-4 w-4" />
                  <span>Нет</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDownIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/vue/24/outline'
import type { FAQ } from '@/types'

interface Props {
  faq: FAQ
  expanded: boolean
}

interface Emits {
  (e: 'toggle'): void
  (e: 'helpful', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()


// Format answer with basic HTML support
const formattedAnswer = computed(() => {
  return props.faq.answer
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
})


// Event handlers
const handleToggle = (): void => {
  emit('toggle')
}

const handleHelpful = (isHelpful: boolean): void => {
  emit('helpful', isHelpful)
  
  // Show feedback (could be enhanced with toast notifications)
  const message = isHelpful 
    ? 'Спасибо за отзыв!' 
    : 'Мы работаем над улучшением ответов'
  
  // Simple alert for now, could be replaced with proper notification system
  console.log(message)
}

// Animation handlers
const onEnter = (el: Element): void => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.offsetHeight // trigger reflow
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
}

const onLeave = (el: Element): void => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.offsetHeight // trigger reflow
  htmlEl.style.height = '0'
}
</script>

<style scoped>
.faq-answer-enter-active,
.faq-answer-leave-active {
  transition: height 0.3s ease-in-out;
}

.faq-answer-enter-from,
.faq-answer-leave-to {
  height: 0;
}
</style>