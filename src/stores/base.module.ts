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
    size: useLocalStorage<BaseSize>('setting.size', 'default'),
    userInfo: useLocalStorage('setting.userInfo', {}),

    setLocale(locale: BaseLang) {
      setting.local = locale
    },
    setTheme(theme: BaseTheme) {
      setting.theme = theme
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
      const route = useRoute()

      function _init(treeData) {
        menu.setTreeList(treeData)

        const authorisedRoutes = flattenMenus(treeData, '/')
        autoPageRoutes.forEach((r) => {
          if (!r.meta?.auth) return
          const item = authorisedRoutes.find((item) => item.path === r.path)
          if (!item && !['/'].includes(item?.path) && !['/'].includes(item?.alias)) {
            router?.removeRoute(r.name)
          } else {
            merge(r, { meta: item.meta })
          }
        })

        menu.setBreadcrumb(authorisedRoutes.find((item) => item.path === route?.path)?.meta?.breadcrumb || [])
      }

      _init(mergeMetaIntoData(data, autoPageRoutes))
      // or fetch api async
    },
  })

  return { setting, menu }
})

function flattenMenus(routes, basePath = '', breadcrumb = []) {
  const list: any[] = []
  const stack = routes.map((route) => ({ route, fullPath: basePath, breadcrumb }))
  while (stack.length) {
    const { route, fullPath, breadcrumb } = stack.pop()
    const currentPath = `${fullPath}/${route.path}`.replace(/\/+/g, '/')
    const _nb = [...breadcrumb]
    if (route.meta?.title) _nb.push(route.meta.title)
    if (route.children?.length)
      stack.push(...route.children.map((child) => ({ route: child, fullPath: currentPath, breadcrumb: _nb })))
    else list.push({ ...route, path: currentPath, meta: { ...route.meta, breadcrumb: _nb } })
  }
  return list
}

// 将 autoPageRoutes 的 meta 合并到 data 中
function mergeMetaIntoData(data, autoPageRoutes) {
  return data.map((item) => {
    const route = find(autoPageRoutes, (r) => r.path === item.path)
    if (route) {
      item.meta = { ...item.meta, ...route.meta }
    }
    if (item.children) {
      item.children = mergeMetaIntoData(item.children, autoPageRoutes)
    }
    return item
  })
}
