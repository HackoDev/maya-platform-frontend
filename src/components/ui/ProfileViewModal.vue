<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="profile-view-modal fixed inset-0 z-50 overflow-hidden"
      @keydown.esc="handleClose"
    >
      <!-- Background Overlay -->
      <div
        class="fixed inset-0 transition-opacity"
        :class="backdropClasses"
        @click="handleBackdropClick"
      />

      <!-- Modal Container -->
      <div class="relative flex items-center justify-center min-h-screen p-4">
        <!-- Modal Content -->
        <div
          class="relative w-full max-w-7xl max-h-[90vh] bg-white dark:bg-gray-900 
                 rounded-lg shadow-2xl overflow-hidden transform transition-all"
          :class="sizeClasses"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0 min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {{ title }}
              </h2>
              <span v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ subtitle }}
              </span>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Share Button -->
              <button
                v-if="showShare"
                @click="handleShare"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                       rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Поделиться профилем"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              <!-- Close Button -->
              <button
                @click="handleClose"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                       rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Закрыть"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="overflow-y-auto max-h-[calc(90vh-80px)] bg-gray-50 dark:bg-gray-900">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  backdrop?: 'blur' | 'dark' | 'transparent'
  closable?: boolean
  closeOnBackdrop?: boolean
  showShare?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'share'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'xl',
  backdrop: 'blur',
  closable: true,
  closeOnBackdrop: true,
  showShare: true
})

const emit = defineEmits<Emits>()

// Computed classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'md':
      return 'max-w-2xl'
    case 'lg':
      return 'max-w-4xl'
    case 'xl':
      return 'max-w-7xl'
    case 'full':
      return 'w-screen h-screen max-w-none max-h-none rounded-none'
    default:
      return 'max-w-7xl'
  }
})

const backdropClasses = computed(() => {
  switch (props.backdrop) {
    case 'blur':
      return 'bg-black/50 backdrop-blur-sm'
    case 'dark':
      return 'bg-black/75'
    case 'transparent':
      return 'bg-black/25'
    default:
      return 'bg-black/50 backdrop-blur-sm'
  }
})

// Event handlers
const handleClose = (): void => {
  if (props.closable) {
    emit('close')
  }
}

const handleBackdropClick = (): void => {
  if (props.closeOnBackdrop && props.closable) {
    emit('close')
  }
}

const handleShare = (): void => {
  emit('share')
}

// Keyboard event handler
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.isOpen && props.closable) {
    handleClose()
  }
}

// Body scroll management
const manageBodyScroll = (isOpen: boolean): void => {
  if (typeof document === 'undefined') return
  
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// Watchers
watch(
  () => props.isOpen,
  (newValue) => {
    manageBodyScroll(newValue)
  },
  { immediate: true }
)

// Lifecycle
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleKeydown)
    
    // Calculate scrollbar width for padding compensation
    const scrollDiv = document.createElement('div')
    scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;'
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    document.body.removeChild(scrollDiv)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
    manageBodyScroll(false)
  }
})
</script>

<style scoped>
/* Ensure modal appears above everything */
.profile-view-modal {
  z-index: 9999;
}

/* Smooth transitions */
.profile-view-modal .transform {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-view-modal .transition-opacity {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus trap styling */
.profile-view-modal:focus-within {
  outline: none;
}

/* Responsive modal sizing */
@media (max-width: 640px) {
  .profile-view-modal .max-w-7xl {
    margin: 0.5rem;
    width: calc(100% - 1rem);
  }
  
  .profile-view-modal .max-h-\[90vh\] {
    max-height: 95vh;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .profile-view-modal .bg-black\/50 {
    background-color: rgba(0, 0, 0, 0.8);
  }
}

/* Print styles - hide modal when printing */
@media print {
  .profile-view-modal {
    display: none !important;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .profile-view-modal .transform,
  .profile-view-modal .transition-opacity {
    transition: none;
  }
}
</style>