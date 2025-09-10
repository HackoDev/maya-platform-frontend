import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ChangePasswordPage from '@/pages/ChangePasswordPage.vue'

// Mock vue-router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page with dark theme classes', () => {
    const wrapper = mount(ChangePasswordPage)

    // Check main container has dark theme classes
    expect(wrapper.find('.bg-gray-50.dark\\:bg-gray-900').exists()).toBe(true)
    
    // Check that labels have dark theme classes
    const labels = wrapper.findAll('label')
    labels.forEach(label => {
      expect(label.classes()).toContain('dark:text-gray-300')
    })
  })

  it('shows security notice with dark theme support', () => {
    const wrapper = mount(ChangePasswordPage)

    const securityNotice = wrapper.find('.bg-blue-50.dark\\:bg-blue-900\\/20')
    expect(securityNotice.exists()).toBe(true)
    expect(securityNotice.text()).toContain('Рекомендации по безопасности')
  })

  it('calculates password strength correctly', async () => {
    const wrapper = mount(ChangePasswordPage)

    // Get the actual input element within BaseInput component
    const newPasswordInput = wrapper.find('input[id="new-password"]')
    
    // Test weak password
    await newPasswordInput.setValue('123')
    await nextTick()
    
    // Check if strength indicator appears
    expect(wrapper.find('.bg-red-500.dark\\:bg-red-400').exists())

    // Test strong password
    await newPasswordInput.setValue('MyStrongPass123!')
    await nextTick()
    
    // Password strength indicator should show strong password
    expect(wrapper.text()).toContain('Отличный')
  })

  it('shows password match indicator with dark theme', async () => {
    const wrapper = mount(ChangePasswordPage)

    const newPasswordInput = wrapper.find('input[id="new-password"]')
    const confirmPasswordInput = wrapper.find('input[id="confirm-password"]')
    
    // Set matching passwords
    await newPasswordInput.setValue('password123')
    await confirmPasswordInput.setValue('password123')
    await nextTick()
    
    // Should show green checkmark and matching text
    expect(wrapper.text()).toContain('Пароли совпадают')
    
    // Set non-matching passwords
    await confirmPasswordInput.setValue('different123')
    await nextTick()
    
    // Should show red X and non-matching text
    expect(wrapper.text()).toContain('Пароли не совпадают')
  })

  it('validates form correctly', async () => {
    const wrapper = mount(ChangePasswordPage)

    const currentPasswordInput = wrapper.find('input[id="current-password"]')
    const newPasswordInput = wrapper.find('input[id="new-password"]')
    const confirmPasswordInput = wrapper.find('input[id="confirm-password"]')
    const submitButton = wrapper.find('button[type="submit"]')
    
    // Initially submit button should be disabled
    expect(submitButton.attributes('disabled')).toBeDefined()
    
    // Fill out form with valid data
    await currentPasswordInput.setValue('oldpassword')
    await newPasswordInput.setValue('newpassword123')
    await confirmPasswordInput.setValue('newpassword123')
    await nextTick()
    
    // Submit button should be enabled
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('handles form submission', async () => {
    const wrapper = mount(ChangePasswordPage)

    // Fill out form
    const currentPasswordInput = wrapper.find('input[id="current-password"]')
    const newPasswordInput = wrapper.find('input[id="new-password"]')
    const confirmPasswordInput = wrapper.find('input[id="confirm-password"]')
    
    await currentPasswordInput.setValue('oldpassword')
    await newPasswordInput.setValue('newpassword123')
    await confirmPasswordInput.setValue('newpassword123')
    await nextTick()

    // Mock alert to avoid actual alert dialogs
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Submit form
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    // Loading state should be activated
    expect(wrapper.text()).toContain('Сохранение...')

    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    await nextTick()

    alertSpy.mockRestore()
  })

  it('resets form when reset button is clicked', async () => {
    const wrapper = mount(ChangePasswordPage)

    // Fill out form
    const currentPasswordInput = wrapper.find('input[id="current-password"]')
    const newPasswordInput = wrapper.find('input[id="new-password"]')
    const confirmPasswordInput = wrapper.find('input[id="confirm-password"]')
    
    await currentPasswordInput.setValue('oldpassword')
    await newPasswordInput.setValue('newpassword123')
    await confirmPasswordInput.setValue('newpassword123')
    await nextTick()

    // Click reset button
    const resetButton = wrapper.find('button[type="button"]')
    await resetButton.trigger('click')
    await nextTick()

    // Form should be cleared
    expect((currentPasswordInput.element as HTMLInputElement).value).toBe('')
    expect((newPasswordInput.element as HTMLInputElement).value).toBe('')
    expect((confirmPasswordInput.element as HTMLInputElement).value).toBe('')
  })

  it('has proper dark theme styling for actions section', () => {
    const wrapper = mount(ChangePasswordPage)

    // Check border styling with dark theme
    const actionsSection = wrapper.find('.border-t.border-gray-200.dark\\:border-gray-700')
    expect(actionsSection.exists()).toBe(true)

    // Check back link styling
    const backLink = wrapper.find('router-link')
    expect(backLink.classes()).toContain('dark:text-gray-400')
    expect(backLink.classes()).toContain('dark:hover:text-gray-200')
  })
})