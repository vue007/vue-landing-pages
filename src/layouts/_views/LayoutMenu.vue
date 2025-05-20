<template>
  <Teleport :to="props.to" defer>
    <el-menu class="layout-menu" mode="horizontal" :defaultActive="menu.active" @select="handleMenuSelect" router>
      <LayoutMenuItem v-for="item in menuList" v-bind="item" :key="item.path"></LayoutMenuItem>
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

const LayoutMenuItem = (props) =>
  props?.children?.length ? (
    <el-sub-menu index={props.path}>
      {{
        title: <LayoutMenuItemSpan {...props} />,
        default: props.children.map((item) => (
          <LayoutMenuItem key={item.path} {...item} path={`${props.path}/${item.path}`} />
        )),
      }}
    </el-sub-menu>
  ) : (
    <el-menu-item index={props.path}>
      <LayoutMenuItemSpan {...props} />
    </el-menu-item>
  )

const LayoutMenuItemSpan = (props) => (
  <>
    {props.meta?.icon ? (
      <el-icon>
        <svg-icon name={props.meta.icon} />
      </el-icon>
    ) : null}
    <span class='min-w-100'>{props.meta?.title}</span>
  </>
)

const { t } = useI18nLocal()
const route = useRoute()
const baseStore = useBaseStore()
const { menu, setting } = baseStore
const menuList = computed(() => menu.treeList)

const props = defineProps({
  to: { type: String, default: '#layout-aside' },
})

const handleMenuSelect = () => {}

watch(
  () => route.path,
  () => {
    let path = route.meta?.isTab ? route.matched[0].path : route.path
    menu.setActive(path)
    menu.setBreadcrumb(route.meta?.breadcrumb as string[])
  },
  { immediate: true },
)

onMounted(() => {
  menu.initMenuList([
    {
      path: '/home',
      meta: {
        title: '首页',
        icon: 'system',
      },
      // children: [
      //   {
      //     name: 'Client123',
      //     path: 'client',
      //     component: 'home/index',
      //     meta: {
      //       title: '客户端管理',
      //       icon: 'user',
      //     },
      //   },
      // ],
    },

    {
      path: '/demo',
      meta: {
        title: 'Demo',
        icon: 'system',
      },
      // children: [
      //   {
      //     path: 'client',
      //     component: 'demo/index',
      //     meta: {
      //       title: 'demo',
      //       icon: 'user',
      //     },
      //   },
      // ],
    },
  ])
})
</script>

<style lang="scss" scoped>
.layout-menu {
  border-right: unset;
  background-color: unset;
  margin-top: 12px;

  #{$size-large} {
    font-size: var(--el-font-size-large);
  }
  #{$size-small} {
    font-size: var(--el-font-size-extra-small);
  }
  :deep(.el-menu) {
    background-color: unset;
  }
}
</style>
