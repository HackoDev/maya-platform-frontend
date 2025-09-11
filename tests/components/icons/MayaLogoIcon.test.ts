import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MayaLogoIcon from '@/components/icons/MayaLogoIcon.vue'

describe('MayaLogoIcon', () => {
  it('renders the SVG icon', () => {
    const wrapper = mount(MayaLogoIcon)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('has the correct viewBox', () => {
    const wrapper = mount(MayaLogoIcon)
    const svg = wrapper.find('svg')
    expect(svg.attributes('viewBox')).toBe('0 0 100 100')
  })

  it('has the correct fill attribute', () => {
    const wrapper = mount(MayaLogoIcon)
    const svg = wrapper.find('svg')
    expect(svg.attributes('fill')).toBe('none')
  })
})