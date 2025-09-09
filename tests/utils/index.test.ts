import { describe, it, expect } from 'vitest'
import { formatDate, debounce, generateId, capitalize, isEmpty } from '@/utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '2023-12-25'
      const formatted = formatDate(dateString)

      expect(formatted).toBe('December 25, 2023')
    })

    it('formats Date object correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)

      expect(formatted).toBe('December 25, 2023')
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      let callCount = 0
      const fn = () => {
        callCount++
      }
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(callCount).toBe(0)

      await new Promise(resolve => setTimeout(resolve, 150))

      expect(callCount).toBe(1)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
      expect(capitalize('a')).toBe('A')
    })

    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('isEmpty', () => {
    it('returns true for empty values', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
    })

    it('returns false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty({ key: 'value' })).toBe(false)
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })
  })
})
