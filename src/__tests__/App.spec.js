import { describe, it, expect } from 'vitest'
import { config, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'

config.global.stubs = {
  RouterLink: true,
  RouterView: true,
}

describe('App', () => {
  it('mounts with layout shell', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div>home</div>' } }],
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })
    expect(wrapper.find('.nav').exists()).toBe(true)
    expect(wrapper.find('.footer').exists()).toBe(true)
  })
})
