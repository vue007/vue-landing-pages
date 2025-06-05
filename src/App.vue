<template>
  <component :is="currentLayout" />
</template>

<script setup lang="ts">
import './styles/sanitize.css'
import './styles/theme/index.scss'

import { useBaseStore } from './stores/base.module'

import BaseLayout from './layouts/BaseLayout.vue'
import BlankLayout from './layouts/BlankLayout.vue'

import { useMediaQuery, watchImmediate } from '@vueuse/core'
import { usePrimeVue } from 'primevue'

const route = useRoute()
const baseStore = useBaseStore()
const { setting } = baseStore
const i18n = useI18n()
const { appContext } = getCurrentInstance()!

// # switch layout
const currentLayout = shallowRef(BaseLayout)
const layouts = { base: BaseLayout, blank: BlankLayout }
watchEffect(() => {
  const layoutName: string = route.meta?.layout as string
  currentLayout.value = layouts[layoutName || 'blank']
})

const primevue = usePrimeVue()
watchEffect(() => {
  primevue.config.locale = i18n.locale.value as any
})

// # switch lang
// const langs = { zh_CN, zh_TW, en }
// const locale = computed(() => langs[setting.local] || zh_CN)
watchEffect(() => (i18n.locale.value = setting.local))

// # switch theme
const theme = computed(() => setting.theme)
const systemTheme = computed(() => {
  return useMediaQuery('(prefers-color-scheme: dark)').value ? 'dark' : 'light'
})

// - switch by user
watchImmediate(
  () => theme.value,
  () => {
    if (theme.value === 'auto') {
      document.documentElement.setAttribute('data-theme', systemTheme.value)
      setting.currentTheme = systemTheme.value
    } else {
      document.documentElement.setAttribute('data-theme', theme.value)
      setting.currentTheme = theme.value
    }
  },
)
// - auto switch by system
watchImmediate(systemTheme, () => {
  if (theme.value !== 'auto') return
  document.documentElement.setAttribute('data-theme', systemTheme.value)
})

watchImmediate(
  () => setting.size,
  (val) => document.documentElement.setAttribute('data-size', val),
)
</script>

<style lang="scss" scoped>
:global(html) {
  font-family: var(--el-font-family);
  width: 100vw;
  height: 100vh;
}
</style>
