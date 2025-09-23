import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useDebounce, useDebouncedCallback } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce value changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    // Initial value should be set immediately
    expect(debouncedValue.value).toBe('initial')

    // Change the value
    value.value = 'changed'
    
    // Debounced value should not change immediately
    expect(debouncedValue.value).toBe('initial')

    // Fast forward time by 300ms
    vi.advanceTimersByTime(300)

    // Now debounced value should be updated
    expect(debouncedValue.value).toBe('changed')
  })

  it('should cancel previous timeout when value changes rapidly', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    // Change value multiple times rapidly
    value.value = 'first'
    value.value = 'second'
    value.value = 'third'

    // Fast forward by 200ms (less than debounce delay)
    vi.advanceTimersByTime(200)
    expect(debouncedValue.value).toBe('initial')

    // Fast forward by another 200ms (total 400ms, more than debounce delay)
    vi.advanceTimersByTime(200)

    // Should only have the last value
    expect(debouncedValue.value).toBe('third')
  })
})

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce callback execution', () => {
    const callback = vi.fn()
    const debouncedCallback = useDebouncedCallback(callback, 300)

    // Call the debounced function multiple times
    debouncedCallback('arg1')
    debouncedCallback('arg2')
    debouncedCallback('arg3')

    // Callback should not be called yet
    expect(callback).not.toHaveBeenCalled()

    // Fast forward by 300ms
    vi.advanceTimersByTime(300)

    // Callback should be called once with the last arguments
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('arg3')
  })

  it('should handle multiple arguments correctly', () => {
    const callback = vi.fn()
    const debouncedCallback = useDebouncedCallback(callback, 300)

    debouncedCallback('arg1', 'arg2', 'arg3')
    vi.advanceTimersByTime(300)

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })
})


