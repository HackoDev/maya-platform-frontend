import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct default values', () => {
    const store = useCounterStore()

    expect(store.count).toBe(0)
    expect(store.doubleCount).toBe(0)
    expect(store.isEven).toBe(true)
  })

  it('increments count correctly', () => {
    const store = useCounterStore()

    store.increment()

    expect(store.count).toBe(1)
    expect(store.doubleCount).toBe(2)
    expect(store.isEven).toBe(false)
  })

  it('decrements count correctly', () => {
    const store = useCounterStore()

    store.setCount(5)
    store.decrement()

    expect(store.count).toBe(4)
    expect(store.doubleCount).toBe(8)
    expect(store.isEven).toBe(true)
  })

  it('resets count to zero', () => {
    const store = useCounterStore()

    store.setCount(10)
    store.reset()

    expect(store.count).toBe(0)
    expect(store.doubleCount).toBe(0)
    expect(store.isEven).toBe(true)
  })

  it('sets count to specific value', () => {
    const store = useCounterStore()

    store.setCount(42)

    expect(store.count).toBe(42)
    expect(store.doubleCount).toBe(84)
    expect(store.isEven).toBe(true)
  })

  it('calculates isEven correctly for odd numbers', () => {
    const store = useCounterStore()

    store.setCount(7)

    expect(store.isEven).toBe(false)
  })
})
