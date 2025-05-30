// @ts-ignore
import autoPageRoutes from '~pages'

import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// import { baseApi } from '@/api/_index'
import { merge } from 'es-toolkit'
import { find } from 'es-toolkit/compat'

export type BaseSize = 'large' | 'default' | 'small'
export type BaseTheme = 'dark' | 'light' | 'auto'
export type BaseLang = 'en' | 'zh-CN' | 'zh-TW'
export type BaseArrangement = 'default' | ''

export const useBaseStore = defineStore('base', () => {
  const router = useRouter()

  const setting = reactive({
    local: useLocalStorage<BaseLang>('setting.local', 'zh-CN'),
    theme: useLocalStorage<BaseTheme>('setting.theme', 'light'),
    currentTheme: ref(''),
    size: useLocalStorage<BaseSize>('setting.size', 'default'),
    userInfo: useLocalStorage('setting.userInfo', {}),

    isDark: computed(() => setting.currentTheme === 'dark'),
    isLight: computed(() => setting.currentTheme === 'light'),

    setLocale(locale: BaseLang) {
      setting.local = locale
    },
    setTheme(theme: BaseTheme) {
      setting.theme = theme
    },
    setCurrentTheme(theme: Omit<BaseTheme, 'auto'>) {
      setting.currentTheme = theme
    },
    setSize(size: BaseSize) {
      setting.size = size
    },

    fetchUserInfo() {
      // return baseApi.getInfo().then((res) => {
      //   setting.userInfo = res.apiData
      //   return res.apiData
      // })
    },
  })

  const menu = reactive({
    collapse: false,
    active: '',
    breadcrumb: [] as any[],
    treeList: [] as any[],
    loaded: false,
    setTreeList(list: any[]) {
      menu.treeList = list
    },
    setBreadcrumb(list: string[]) {
      menu.breadcrumb = list
    },
    setCollapse(flag) {
      menu.collapse = flag
    },
    toggleCollapse() {
      menu.setCollapse(!menu.collapse)
    },
    setActive(path: string) {
      menu.active = path
    },

    initMenuList(data) {
      menu.loaded = false
      const route = useRoute()

      function _init(treeData) {
        menu.setTreeList(treeData)
      }

      _init(matchMenuFromPage(data, autoPageRoutes))
      // or fetch api async
      setTimeout(() => {
        menu.loaded = true
      }, 50)
    },
  })

  return { setting, menu }
})

// 使用 vue-router 的 resolve/matched 进行路由模式匹配，支持动态路由如 demo/:id
function matchMenuFromPage(menuData, pageRoutes) {
  const router = useRouter()
  return menuData.map((item) => {
    // 查找能匹配 item.path 的路由记录
    const route = find(pageRoutes, (r) => {
      try {
        const resolved = router.resolve(item.path)
        // 判断 matched 路由记录中是否有 r
        return resolved.matched.some((m) => m.name === r.name || m.path === r.path)
      } catch {
        return false
      }
    })
    if (route) {
      item.meta = merge(item.meta || {}, route.meta || {})
      item.children = matchMenuFromPage(item.children || [], pageRoutes)
    }
    return item
  })
}
