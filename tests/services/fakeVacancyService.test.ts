import { describe, it, expect } from 'vitest'
import { 
  generateFakeVacancies, 
  getPaginatedVacancies, 
  getFakeVacancies,
  getVacancyById,
  generateFakeVacancyWithId,
  type FakeVacancy,
  type FakeContactInfo
} from '@/services/fakeVacancyService'

describe('fakeVacancyService', () => {
  it('should generate fake vacancies with correct structure', () => {
    const vacancies = generateFakeVacancies(5)
    
    expect(vacancies).toHaveLength(5)
    
    vacancies.forEach(vacancy => {
      expect(vacancy).toHaveProperty('id')
      expect(vacancy).toHaveProperty('title')
      expect(vacancy).toHaveProperty('description')
      expect(vacancy).toHaveProperty('status')
      expect(vacancy).toHaveProperty('createdAt')
      expect(vacancy).toHaveProperty('updatedAt')
      expect(vacancy).toHaveProperty('clientId')
      expect(vacancy).toHaveProperty('clientName')
      expect(vacancy).toHaveProperty('contactInfo')
      
      // Check contact info structure
      const contactInfo = vacancy.contactInfo as FakeContactInfo
      expect(contactInfo).toHaveProperty('phone')
      expect(contactInfo).toHaveProperty('telegram')
      expect(contactInfo).toHaveProperty('whatsapp')
      
      // Check that contact info values are not empty
      expect(contactInfo.phone).toBeTruthy()
      expect(contactInfo.telegram).toBeTruthy()
      expect(contactInfo.whatsapp).toBeTruthy()
    })
  })

  it('should generate 20 fake vacancies by default', () => {
    const vacancies = getFakeVacancies()
    expect(vacancies).toHaveLength(20)
  })

  it('should return paginated vacancies with correct limit', () => {
    const page1 = getPaginatedVacancies(1, 7)
    const page2 = getPaginatedVacancies(2, 7)
    
    expect(page1.vacancies).toHaveLength(7)
    expect(page2.vacancies).toHaveLength(7)
    expect(page1.total).toBe(20)
    expect(page2.total).toBe(20)
    
    // Check that pages don't overlap
    const page1Ids = page1.vacancies.map(v => v.id)
    const page2Ids = page2.vacancies.map(v => v.id)
    
    page1Ids.forEach(id => {
      expect(page2Ids).not.toContain(id)
    })
  })

  it('should correctly indicate when there are more vacancies', () => {
    // First page should have more
    const page1 = getPaginatedVacancies(1, 7)
    expect(page1.hasMore).toBe(true)
    
    // Last page should not have more
    const page3 = getPaginatedVacancies(3, 7)
    expect(page3.hasMore).toBe(false)
  })

  it('should return specific vacancy by ID', () => {
    const vacancy = getVacancyById('vacancy-1')
    expect(vacancy).toBeDefined()
    expect(vacancy?.id).toBe('vacancy-1')
  })

  it('should generate fake vacancy with specific ID', () => {
    const vacancy = generateFakeVacancyWithId('test-id')
    expect(vacancy.id).toBe('test-id')
    expect(vacancy).toHaveProperty('title')
    expect(vacancy).toHaveProperty('description')
    expect(vacancy).toHaveProperty('contactInfo')
  })
})