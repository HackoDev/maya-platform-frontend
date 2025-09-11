import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

export interface UseInfiniteScrollOptions {
  /**
   * Root margin for intersection observer
   * @default '100px'
   */
  rootMargin?: string
  
  /**
   * Threshold for intersection observer
   * @default 0.1
   */
  threshold?: number
  
  /**
   * Throttle delay in milliseconds
   * @default 300
   */
  throttleDelay?: number
  
  /**
   * Whether infinite scroll is enabled
   * @default true
   */
  enabled?: boolean
}

export interface UseInfiniteScrollReturn {
  /**
   * Template ref for the trigger element
   */
  triggerRef: ReturnType<typeof ref<HTMLElement | undefined>>
  
  /**
   * Whether the observer is currently active
   */
  isActive: ReturnType<typeof ref<boolean>>
  
  /**
   * Manually trigger the callback
   */
  trigger: () => void
  
  /**
   * Reset the observer (useful when data changes)
   */
  reset: () => void
}

/**
 * Composable for infinite scroll functionality using Intersection Observer API
 * 
 * @param callback Function to call when trigger element intersects
 * @param options Configuration options
 * @returns Object with trigger ref and control methods
 */
export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    throttleDelay = 300,
    enabled = true,
  } = options

  const triggerRef = ref<HTMLElement>()
  const isActive = ref(false)
  
  let observer: IntersectionObserver | null = null
  let throttleTimeoutId: number | null = null
  let lastExecutionTime = 0

  // Throttle function to prevent excessive callback calls
  const throttledCallback = () => {
    const now = Date.now()
    
    if (now - lastExecutionTime >= throttleDelay) {
      callback()
      lastExecutionTime = now
    } else {
      if (throttleTimeoutId) {
        clearTimeout(throttleTimeoutId)
      }
      
      throttleTimeoutId = window.setTimeout(() => {
        callback()
        lastExecutionTime = Date.now()
      }, throttleDelay - (now - lastExecutionTime))
    }
  }

  // Setup intersection observer
  const setupObserver = () => {
    if (!triggerRef.value || observer || !enabled) {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        
        if (entry.isIntersecting && isActive.value) {
          throttledCallback()
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    )

    observer.observe(triggerRef.value)
  }

  // Cleanup intersection observer
  const cleanupObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    
    if (throttleTimeoutId) {
      clearTimeout(throttleTimeoutId)
      throttleTimeoutId = null
    }
  }

  // Reset observer
  const reset = () => {
    cleanupObserver()
    
    nextTick(() => {
      if (enabled && triggerRef.value) {
        setupObserver()
        isActive.value = true
      } else {
        isActive.value = false
      }
    })
  }

  // Manual trigger
  const trigger = () => {
    if (enabled && isActive.value) {
      throttledCallback()
    }
  }

  // Setup observer when component mounts
  onMounted(() => {
    reset()
  })

  // Cleanup when component unmounts
  onUnmounted(() => {
    cleanupObserver()
  })

  // Watch for changes in enabled state
  watch(
    () => enabled,
    (newEnabled) => {
      if (newEnabled) {
        reset()
      } else {
        cleanupObserver()
        isActive.value = false
      }
    }
  )

  return {
    triggerRef,
    isActive,
    trigger,
    reset,
  }
}