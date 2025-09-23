<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    :data-testid="`faq-item-${faq.id}`"
  >
    <button
      type="button"
      class="w-full px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
      :class="[
        expanded ? 'border-b border-gray-200 dark:border-gray-700' : '',
        'dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-200'
      ]"
      @click="handleToggle"
      @keydown.enter="handleToggle"
      @keydown.space.prevent="handleToggle"
      :aria-expanded="expanded"
      :aria-controls="`faq-answer-${faq.id}`"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 pr-4">
          <h3 class="text-base font-medium text-gray-900 dark:text-white">
            {{ faq.question }}
          </h3>
        </div>
        
        <ChevronDownIcon
          class="h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200"
          :class="expanded ? 'transform rotate-180' : ''"
        />
      </div>
    </button>

    <Transition
      name="faq-answer"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="expanded"
        :id="`faq-answer-${faq.id}`"
        class="px-4 pb-3 overflow-hidden"
        role="region"
        :aria-labelledby="`faq-question-${faq.id}`"
      >
        <div class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {{ faq.answer }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import type { SimplifiedFAQ } from '@/types'

interface Props {
  faq: SimplifiedFAQ
  expanded: boolean
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Event handlers
const handleToggle = (): void => {
  emit('toggle')
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