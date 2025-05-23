<template>
  <Teleport :to="props.to" defer>
    <el-menu
      class="layout-menu"
      mode="horizontal"
      :popper-offset="1"
      :ellipsis="false"
      :defaultActive="menu.active"
      @select="handleMenuSelect"
      router
    >
      <LayoutMenuItem v-for="item in menuList" v-bind="item" :key="item.path"></LayoutMenuItem>
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

const LayoutMenuItem = (props) => {
  if (props === undefined) return null

  return props?.children?.length ? (
    <el-sub-menu index={props.path}>
      {{
        title: <LayoutMenuItemSpan {...props} />,
        default: props.children.map((item) => (
          <LayoutMenuItem key={item.path} {...item} path={`${props.path}/${item.path}`} />
        )),
      }}
    </el-sub-menu>
  ) : (
    <el-menu-item id={props.path} index={props.path}>
      <LayoutMenuItemSpan {...props} />
    </el-menu-item>
  )
}

const LayoutMenuItemSpan = (props) => (
  <>
    {props.meta?.icon ? (
      <el-icon>
        <svg-icon name={props.meta.icon} />
      </el-icon>
    ) : null}
    <span class='min-w-20'>{props.meta?.title}</span>
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
    },

    {
      path: '/demo',
      meta: {
        title: 'Demo',
      },
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

.el-menu--horizontal {
  --el-menu-horizontal-height: 50px;

  #{$size-large} {
    --el-menu-horizontal-height: 60px;
  }
  #{$size-small} {
    --el-menu-horizontal-height: 40px;
  }
}
</style>
