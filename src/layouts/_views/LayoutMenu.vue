<template>
  <Teleport :to="props.to" defer>
    <el-menu
      class="layout-menu"
      mode="horizontal"
      :popper-offset="1"
      :ellipsis="true"
      style="max-width: 400px"
      :defaultActive="menu.active"
      @select="handleMenuSelect"
      router
    >
      <template v-for="item in menuList">
        <el-sub-menu v-if="item?.children?.length" :index="item.path">
          <template #title>
            <LayoutMenuItemSpan v-bind="item" />
          </template>
          <LayoutMenuItem
            v-for="child in item.children"
            :key="child.path"
            :item="child"
            :path="`${item.path}/${child.path}`"
          />
        </el-sub-menu>
        <el-menu-item v-else :id="item.path" :index="item.path">
          <LayoutMenuItemSpan v-bind="item" />
        </el-menu-item>
      </template>
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

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
  width: 100%;

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
