<template>
  <div class="space-y-4">
    <div class="text-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Подтверждение email
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Мы отправили код подтверждения на <strong>{{ email }}</strong>
      </p>
    </div>

    <div class="flex justify-center">
      <div class="flex space-x-2">
        <input
          v-for="(digit, index) in digits"
          :key="index"
          :ref="(el) => setInputRef(el, index)"
          v-model="digits[index]"
          type="text"
          maxlength="1"
          class="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          :class="{
            'border-red-500 focus:ring-red-500': hasError,
            'border-green-500 focus:ring-green-500': isValid
          }"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          @paste="handlePaste"
        />
      </div>
    </div>

    <div v-if="errorMessage" class="text-center">
      <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <div v-if="successMessage" class="text-center">
      <p class="text-sm text-green-600 dark:text-green-400">{{ successMessage }}</p>
    </div>

    <div class="text-center">
      <button
        type="button"
        @click="$emit('resend')"
        :disabled="isResending"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isResending ? 'Отправка...' : 'Отправить код повторно' }}
      </button>
    </div>

    <div class="text-center">
      <button
        type="button"
        @click="$emit('cancel')"
        class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        Отмена
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Props {
  email: string
  length?: number
  errorMessage?: string
  successMessage?: string
  isResending?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
  (e: 'resend'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  errorMessage: '',
  successMessage: '',
  isResending: false
})

const emit = defineEmits<Emits>()

const digits = ref<string[]>(new Array(props.length).fill(''))
const inputRefs = ref<(HTMLInputElement | null)[]>([])

const isValid = ref(false)
const hasError = ref(false)

const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  // Очищаем предыдущие ошибки
  hasError.value = false

  // Если введен символ, переходим к следующему полю
  if (value && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }

  // Обновляем значение
  digits.value[index] = value

  // Проверяем, заполнен ли весь код
  const code = digits.value.join('')
  emit('update:modelValue', code)

  if (code.length === props.length) {
    isValid.value = true
    emit('complete', code)
  } else {
    isValid.value = false
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement

  // Обработка Backspace
  if (event.key === 'Backspace') {
    if (!target.value && index > 0) {
      // Если поле пустое, переходим к предыдущему полю
      nextTick(() => {
        inputRefs.value[index - 1]?.focus()
      })
    }
  }

  // Обработка стрелок
  if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }

  if (event.key === 'ArrowRight' && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }

  // Разрешаем только цифры
  if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const numbers = pastedData.replace(/\D/g, '').slice(0, props.length)

  if (numbers.length > 0) {
    for (let i = 0; i < numbers.length && i < props.length; i++) {
      digits.value[i] = numbers[i]
    }

    const code = digits.value.join('')
    emit('update:modelValue', code)

    if (code.length === props.length) {
      isValid.value = true
      emit('complete', code)
    }

    // Фокусируемся на последнем заполненном поле
    const lastFilledIndex = Math.min(numbers.length - 1, props.length - 1)
    nextTick(() => {
      inputRefs.value[lastFilledIndex]?.focus()
    })
  }
}

const clear = () => {
  digits.value = new Array(props.length).fill('')
  isValid.value = false
  hasError.value = false
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
}

const setError = (message: string) => {
  hasError.value = true
  // Можно добавить логику для показа ошибки
}

// Фокусируемся на первом поле при монтировании
onMounted(() => {
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
})

// Экспортируем методы для родительского компонента
defineExpose({
  clear,
  setError
})
</script>
